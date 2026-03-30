// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.

import type { Vector2 } from '../types';
import { createSignalingChannel, sendSignal, onSignal, generateRoomCode, closeSignaling } from './signaling';

export type PeerMessage =
  | { type: 'position'; playerIndex: number; position: Vector2; velocity: Vector2 }
  | { type: 'input'; playerIndex: number; action: string }
  | { type: 'sync'; state: any };

let peerConnection: RTCPeerConnection | null = null;
let dataChannel: RTCDataChannel | null = null;
let connectionState: RTCPeerConnectionState = 'new';
let currentRoomCode = '';
let onMessageCallback: ((msg: PeerMessage) => void) | null = null;
let isHost = false;

const ICE_SERVERS = [{ urls: 'stun:stun.l.google.com:19302' }];

function setupPeerConnection(): void {
  peerConnection = new RTCPeerConnection({ iceServers: ICE_SERVERS });

  peerConnection.onicecandidate = (event) => {
    if (event.candidate) {
      sendSignal({ type: 'ice-candidate', candidate: event.candidate });
    }
  };

  peerConnection.onconnectionstatechange = () => {
    connectionState = peerConnection?.connectionState ?? 'failed';
  };
}

export function createRoom(): string {
  currentRoomCode = generateRoomCode();
  isHost = true;

  createSignalingChannel(currentRoomCode);
  setupPeerConnection();

  // Host creates data channel
  dataChannel = peerConnection!.createDataChannel('game');
  setupDataChannel(dataChannel);

  onSignal(async (signal) => {
    if (signal.type === 'answer' && peerConnection) {
      await peerConnection.setRemoteDescription(signal.sdp);
    } else if (signal.type === 'ice-candidate' && peerConnection) {
      await peerConnection.addIceCandidate(signal.candidate);
    } else if (signal.type === 'join') {
      // Guest wants to join — create and send offer
      const offer = await peerConnection!.createOffer();
      await peerConnection!.setLocalDescription(offer);
      sendSignal({ type: 'offer', sdp: offer });
    }
  });

  return currentRoomCode;
}

export async function joinRoom(roomCode: string): Promise<void> {
  currentRoomCode = roomCode;
  isHost = false;

  createSignalingChannel(roomCode);
  setupPeerConnection();

  peerConnection!.ondatachannel = (event) => {
    dataChannel = event.channel;
    setupDataChannel(dataChannel);
  };

  onSignal(async (signal) => {
    if (signal.type === 'offer' && peerConnection) {
      await peerConnection.setRemoteDescription(signal.sdp);
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      sendSignal({ type: 'answer', sdp: answer });
    } else if (signal.type === 'ice-candidate' && peerConnection) {
      await peerConnection.addIceCandidate(signal.candidate);
    }
  });

  // Signal that we want to join
  sendSignal({ type: 'join' });
}

function setupDataChannel(channel: RTCDataChannel): void {
  channel.onmessage = (event) => {
    try {
      const msg: PeerMessage = JSON.parse(event.data);
      onMessageCallback?.(msg);
    } catch {
      // ignore malformed messages
    }
  };
}

export function sendPeerMessage(msg: PeerMessage): void {
  if (dataChannel?.readyState === 'open') {
    dataChannel.send(JSON.stringify(msg));
  }
}

export function onPeerMessage(handler: (msg: PeerMessage) => void): void {
  onMessageCallback = handler;
}

export function getConnectionState(): string {
  return connectionState;
}

export function isHostPlayer(): boolean {
  return isHost;
}

export function disconnect(): void {
  dataChannel?.close();
  peerConnection?.close();
  closeSignaling();
  peerConnection = null;
  dataChannel = null;
  connectionState = 'new';
}

export function getRoomCode(): string {
  return currentRoomCode;
}
