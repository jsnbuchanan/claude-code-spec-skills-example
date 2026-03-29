---
slug: retro-joust-browser-battle-arena
created: 2026-03-28
tags: [spec, golden-circle]
---
# Retro Joust Browser Battle Arena

## Why

There is no high-quality, browser-native Joust experience that captures the competitive thrill of the 1982 arcade original while modernizing it for today's players. Existing options require emulator setup or are low-fidelity clones. Players who want to casually challenge friends to a Joust match have no instant, shareable, visually polished way to do so — and the original formula has untapped potential for new mechanics, online multiplayer, and modern presentation.

## How

Build a browser-native Joust game using WebGL-accelerated 2D rendering (PixiJS) with WebRTC peer-to-peer multiplayer. The game faithfully recreates the original's core mechanics — flap-to-fly physics, lance-height combat, platform traversal, and wave-based enemy progression — while adding modern visual polish (particle effects, smooth animations, dynamic lighting), online 1v1/2v2 multiplayer via WebRTC, new mechanics (power-ups, additional enemy types, survival mode), and persistent leaderboards. The client is a static web app deployable to Vercel with no authoritative game server — peers negotiate state directly.

**Key trade-offs accepted:**
- **WebRTC P2P over authoritative server** — lower latency and zero server cost, but susceptible to cheating and NAT traversal issues. Acceptable for a fun/showcase project, not a competitive esport.
- **Full scope in v1** — higher initial effort but delivers the complete differentiating experience from launch.
- **PixiJS over raw Canvas** — adds a dependency but provides GPU acceleration, sprite batching, and a particle system out of the box.

### In Scope

- Core Joust mechanics — flap-to-fly physics, gravity, lance-height combat (higher lance wins), platform collision, screen-wrap
- Wave-based enemy progression — Bounder, Hunter, Shadow Lord enemy types with increasing difficulty
- Egg/knight lifecycle — defeated enemies drop eggs that hatch into stronger enemies if not collected
- Local multiplayer — 2-player on one keyboard
- Online multiplayer — 1v1 and 2v2 via WebRTC peer-to-peer with lobby/room creation and invite links
- WebGL 2D rendering — PixiJS-based renderer with sprite animations, particle effects (sparks, feathers), and dynamic lighting
- Modern visual style — updated pixel art or stylized vector art, smooth 60fps animations, screen shake, hit effects
- New mechanics — power-ups (speed boost, shield, double lance), 1-2 new enemy types beyond the original
- Game modes — Classic (wave-based), Survival (endless), and Versus (PvP-only arena)
- Leaderboards — persistent high scores per mode (stored server-side via Upstash Redis)
- Audio — sound effects and background music (retro-inspired)
- Responsive layout — playable on desktop browsers; keyboard and gamepad input
- Deployable to Vercel — static build with API route for leaderboards and signaling

### Out of Scope

- Mobile touch controls — complex virtual joystick for a flap-based game is a separate UX effort
- Anti-cheat system — P2P architecture inherently trusts clients; no investment in cheat prevention
- User accounts / authentication — leaderboard entries use display names, no login required
- Level editor — custom map creation is a future feature
- AI co-op partner — AI enemies only, no AI-controlled friendly player
- 3D rendering — strictly 2D presentation
- Monetization — no ads, in-app purchases, or paywalls

### Acceptance Criteria

- [ ] **AC-1:** **Given** the game is loaded in a browser, **When** the player presses the flap key, **Then** the player character gains upward velocity, is affected by gravity between flaps, and lands on platforms with correct collision — achieving fluid flap-to-fly movement at 60fps.
- [ ] **AC-2:** **Given** two characters (player or enemy) collide, **When** one character's lance position is higher than the other's, **Then** the higher character defeats the lower one, a defeated-enemy egg drops to the nearest platform, and a particle burst plays at the collision point.
- [ ] **AC-3:** **Given** a defeated enemy has dropped an egg, **When** the egg is not collected within a timeout period, **Then** it hatches into a stronger enemy type. **When** the player collects the egg before hatching, **Then** the player's score increases and the egg is removed.
- [ ] **AC-4:** **Given** the player selects Classic mode, **When** all enemies in a wave are defeated, **Then** the next wave spawns with more numerous and/or higher-tier enemies (Bounder -> Hunter -> Shadow Lord progression), and a wave counter is displayed.
- [ ] **AC-5:** **Given** two players are on the same keyboard, **When** they start a local multiplayer game, **Then** each player controls an independent character with separate key bindings, and both characters interact with the same game world (enemies, platforms, combat).
- [ ] **AC-6:** **Given** a player creates an online game room, **When** a second player joins via the invite link, **Then** a WebRTC peer connection is established, both players see each other's characters in real-time with under 150ms perceived input delay, and gameplay state stays synchronized.
- [ ] **AC-7:** **Given** the game is rendering, **When** visual effects trigger (combat sparks, feather particles, screen shake on defeat, dynamic lighting near lava), **Then** effects render via WebGL with no frame drops below 55fps on a mid-range device (e.g., integrated GPU laptop).
- [ ] **AC-8:** **Given** a player completes a game in any mode, **When** their score qualifies for the leaderboard, **Then** their display name and score are persisted and appear on the leaderboard, sorted by score descending, and the leaderboard is visible from the main menu.

### User Flows

**Happy Path: Play Online 1v1**
1. Player opens the game URL in their browser
2. Main menu loads with mode selection: Classic, Survival, Versus, and Online
3. Player selects Online -> Create Room
4. Game generates a room code and shareable invite link
5. Player shares the link with a friend
6. Friend opens the link — WebRTC handshake completes, both players appear in a lobby
7. Host presses "Start" — the arena loads with both player characters on platforms
8. Players flap, joust, and combat enemies (Classic online) or each other (Versus)
9. On game over, scores display with option to submit to leaderboard
10. Players can rematch or return to menu

**Error: WebRTC Connection Failure**
1. Player creates a room and shares the invite link
2. Friend opens the link but the WebRTC handshake fails (NAT traversal blocked, firewall, etc.)
3. A connection status indicator shows "Connecting..." for up to 10 seconds
4. After timeout, the game displays: "Could not connect — try a different network or play locally"
5. Player is returned to the main menu with the local play option highlighted

**Edge: Peer Disconnects Mid-Game**
1. Two players are in an active online match
2. One player's connection drops (closes tab, network failure)
3. The remaining player sees a "Opponent disconnected" overlay within 3 seconds
4. The game pauses, offering: "Continue solo vs AI" or "Return to menu"
5. If the match was competitive (Versus), the disconnecting player forfeits and the remaining player's score is eligible for leaderboard

## What

### System Boundaries

- **Game engine module** — physics (gravity, flap impulse, collision), combat resolution, entity management, wave spawner, egg lifecycle
- **Renderer** — PixiJS stage, sprite management, particle systems, camera/screen shake, dynamic lighting
- **Input system** — keyboard handler (multi-player key maps), gamepad API
- **Networking module** — WebRTC peer connection, signaling (via Vercel serverless API route), state synchronization protocol
- **Leaderboard API** — Vercel API route (serverless), Upstash Redis for persistence
- **Signaling API** — Vercel API route for WebRTC SDP/ICE exchange, room creation/joining
- **Test mode API** — `window.game` debug interface exposing positions, entities, FPS, wave state for Playwright inspection
- **UI shell** — main menu, lobby, HUD (score, wave, lives), leaderboard display

### Feedback Harnesses

Every AC has an automated feedback loop. Manual feedback is exceptional and justified.

| AC | Fidelity | Layer(s) | Trigger | Observable Seam | Terminal Condition | Test Infra |
|----|----------|----------|---------|-----------------|-------------------|------------|
| AC-1 | live | e2e | Playwright launches dev server, presses flap key repeatedly | `window.game.getPlayerPosition()` Y-coordinate and FPS counter | Character Y rises >50px within 300ms of flap, falls back under gravity, rests on platform collision box. FPS >= 60 | new — Playwright + Vite dev server + `window.game` position API |
| AC-2 | live | e2e | Playwright spawns two characters at controlled positions via test-mode, moves higher into lower | `window.game.getLastCombatResult()` and particle system active count | Returns `{winner, loser, eggSpawned: true}`. Particle system `.activeCount > 0` at collision frame | new — Playwright + `window.game` test-mode API for deterministic positioning |
| AC-3 | integration | backend, e2e | Vitest: game logic module with controllable clock. Playwright: visual confirmation of egg hatch/collect | Game state query: egg entity status (collected / hatched / active) | Path A: after timeout, enemy count increases by 1 with higher tier. Path B: collecting before timeout increases score and removes egg entity | new — Vitest (egg timer + hatch logic with mock clock) + Playwright (visual confirmation) |
| AC-4 | live | e2e | Playwright plays through wave 1 using test-mode instant-kill, observes wave 2 spawn | Wave counter DOM text; `window.game.getWaveEnemies()` | Wave counter increments "Wave 1" -> "Wave 2". Wave 2 enemy count > wave 1 OR includes higher-tier types | new — Playwright + `window.game` wave inspection API |
| AC-5 | live | e2e | Playwright sends simultaneous key events for P1 (arrows) and P2 (WASD) | `window.game.getPlayerPosition(1)` vs `window.game.getPlayerPosition(2)` | Positions diverge after independent inputs. Both characters interact with same enemy entities | new — Playwright multi-key input + game state API |
| AC-6 | integration | e2e | Playwright opens two browser contexts; context A creates room, context B joins via invite URL | `RTCPeerConnection.connectionState` in both contexts; position sync between peers | Connection state === 'connected' in both contexts. Position update from peer A visible in peer B within 150ms | new — Playwright dual browser context + WebRTC state inspection + latency measurement |
| AC-7 | live | e2e | Playwright triggers combat events in test mode, captures FPS during particle-heavy scenes | `window.game.getFPS()` and `performance.measure()` frame times | FPS >= 55 during 5-second combat sequence with >= 3 simultaneous particle emitters. No single frame exceeds 18ms | new — Playwright + exposed FPS/frame-time metrics on `window.game` |
| AC-8 | integration | backend, e2e | Vitest: POST/GET `/api/leaderboard` with test data. Playwright: complete game and submit score | API response JSON; leaderboard DOM list in main menu | POST returns 201 with `{rank}`. GET returns sorted array. Playwright: submitted name appears in leaderboard list | new — Vitest (API route testing against dev server) + Playwright (end-to-end submission flow) |

<!-- Feedback Harness column definitions:
- Fidelity: live = real service interaction (CLI against backend, browser automation + live backend, Docker, real APIs). integration = multiple real components, mocks only at true external boundaries. isolated = unit tests with mocks (justify why higher fidelity is infeasible). manual = human-only (justify).
- Layer(s): backend (your backend test runner), frontend (your frontend test runner), e2e (browser automation), external:{service} = contract test
- Trigger: what initiates the feedback loop
- Observable Seam: observable behavior to inspect (not source code)
- Terminal Condition: concrete assertion proving the AC passed
- Test Infra: exists / partial / new — describe what covers or is missing -->

### External Dependencies

| Service | Functionality In Scope | Integration Status | Env Var | Est. Cost/Call | Test Budget (total) |
|---------|----------------------|-------------------|---------|---------------|---------------------|
| Google Public STUN | NAT traversal for WebRTC peer connections | new — hardcoded `stun:stun.l.google.com:19302` | None | Free | $0 |
| WebRTC Signaling | SDP/ICE exchange for room creation and joining | new — Vercel serverless API route with in-memory or Redis-backed room state | `SIGNALING_URL` (optional, defaults to same origin) | Free (Vercel serverless free tier) | $0 |
| Upstash Redis | Persistent leaderboard storage (sorted sets) | new — install via Vercel Marketplace | `KV_REST_API_URL`, `KV_REST_API_TOKEN` | Free tier: 10k req/day | $0 |

<!-- Column definitions:
- Integration Status: existing = wrapper + endpoint wired. partial — describe what exists / what's missing. new — describe what to build.
- Env Var: environment variable name. For existing wrappers, read from config/availability check. For new, use convention.
- Est. Cost/Call: Free = $0. Cheap < $0.10. Expensive >= $0.10. Unknown when pricing requires auth.
- Test Budget (total): Dollar ceiling for ALL real API calls during implementation + testing. -->
