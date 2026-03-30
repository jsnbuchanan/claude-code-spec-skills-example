// Lightweight signaling for WebRTC using BroadcastChannel (same device)
// For cross-network, falls back to manual SDP copy-paste

type SignalHandler = (signal: any) => void;

let channel: BroadcastChannel | null = null;
let onSignalCallback: SignalHandler | null = null;

export function createSignalingChannel(roomCode: string): void {
  channel = new BroadcastChannel(`joust-room-${roomCode}`);
  channel.onmessage = (event) => {
    if (onSignalCallback) {
      onSignalCallback(event.data);
    }
  };
}

export function sendSignal(data: any): void {
  channel?.postMessage(data);
}

export function onSignal(handler: SignalHandler): void {
  onSignalCallback = handler;
}

export function closeSignaling(): void {
  channel?.close();
  channel = null;
  onSignalCallback = null;
}

export function generateRoomCode(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}
