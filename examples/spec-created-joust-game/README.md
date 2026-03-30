### /draft-spec create a retro-style joust battle arena game

This game was built entirely through Claude Code's spec-driven skills workflow. Starting from a single prompt, the process moved through four phases — discovery, promotion, implementation, and delivery — each orchestrated by a dedicated skill that enforced structure, feedback loops, and quality gates before advancing.

1. **`/draft-spec`** — Guided Socratic discovery of the problem (Why), solution approach (How), and acceptance criteria with automated feedback harnesses (What), producing a complete specification.
2. **`/promote-spec`** — Moved the draft spec from `vault/specs/draft/` to `vault/specs/ready/` via a branch and PR, gating on review before implementation could begin.
3. **`/implement-spec`** — Autonomously wrote failing test harnesses from the spec's acceptance criteria, then implemented the solution to make all tests pass, with automated review loops enforcing spec alignment.
4. **`/push-spec`** — Committed, pushed, and opened a PR with the spec's Why/How/What as the PR body, then progressed the spec to `vault/specs/implemented/`.

#### Examine the spec

The full specification — including the problem statement, solution design, acceptance criteria, user flows, feedback harness table, and system boundaries — lives in the vault. It's the single source of truth that drove every implementation decision.

[Read the spec](../../vault/specs/implemented/example-spec-created-with-skills_retro-joust-browser-battle-arena/spec.md)

#### Gameplay

**Core Mechanics**
- **Flap-to-fly physics** — tap the flap key to gain altitude; gravity pulls you down between flaps. Land on platforms to rest.
- **Lance-height combat** — the jouster with the higher lance (higher position on screen) wins the collision. The loser drops an egg.
- **Egg lifecycle** — collect dropped eggs for points before they hatch into stronger enemies (Bounder → Hunter → Shadow Lord).
- **Screen wrap** — fly off one side of the screen and appear on the other.
- **Lives and respawn** — 3 lives per game. Losing combat costs a life and triggers a respawn with an anime-style death face (X eyes, O mouth).

**Game Modes**
- **Classic** — wave-based enemy progression with increasing difficulty and enemy tier upgrades.
- **Survival** — endless waves, see how long you can last.
- **Versus** — 2-player local PvP on one keyboard (Player 1: Arrow keys, Player 2: WASD).

**Features**
- **Player avatar selection** — choose from 4 character avatars (Brian, Les, Matt, Trent) or play as a generic jouster. Your avatar appears as a bobblehead on your bird.
- **Bobblehead animations** — head bobbles with movement, bounces on triumph, and shows an anime death face when defeated.
- **Retro countdown** — "READY PLAYER 1" followed by a 3…2…1…FIGHT! countdown with square-wave beeps.
- **PixiJS WebGL rendering** — procedural bird sprites with animated wings, particle effects on combat, screen shake on defeat, and animated lava glow.
- **Leaderboard** — high scores persist in localStorage across sessions, accessible from the main menu.
- **Online multiplayer** — WebRTC peer-to-peer with BroadcastChannel signaling for same-device play.
- **Full test suite** — 6 unit tests (Vitest) and 18 end-to-end tests (Playwright) covering all 8 acceptance criteria.

**Controls**
| Action | Player 1 | Player 2 |
|--------|----------|----------|
| Flap | Arrow Up | W |
| Move Left | Arrow Left | A |
| Move Right | Arrow Right | D |

**Running the game**
```bash
cd examples/spec-created-joust-game
npm install
npm run dev
```

#### Your turn

Add your own improvements — power-ups, new enemy types, audio, mobile controls, whatever you want. Or forget Joust entirely and show us what *you're* working with. Use the spec skills to go from idea to implementation on your own project.

Either way, we want to see it. Submit a Pull Request to this repo with your creation, your improvements, or your honest "meh, here's what happened" story. Successes, failures, and everything in between are welcome — that's how we all learn what these tools can actually do.
