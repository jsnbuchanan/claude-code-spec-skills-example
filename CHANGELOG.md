# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.1] - 2026-03-30

### Fixed

- PDF and ZIP download links in README now trigger direct browser downloads instead of showing GitHub's file viewer
- Corrected file paths for `spec-workflow-skills.zip` and `How to use these skills.pdf`

## [1.0.0] - 2026-03-30

### Added

**Spec-Driven Skills Workflow**
- Four Claude Code custom skills (`/draft-spec`, `/promote-spec`, `/implement-spec`, `/push-spec`) that orchestrate a complete idea-to-implementation lifecycle
- Vault-based spec management with draft → ready → implemented lifecycle progression
- Automated feedback harness generation from acceptance criteria
- Review loops with spec-alignment scoring and iteration

**Retro Joust Browser Battle Arena**
- Browser-native Joust game built entirely through the spec-driven workflow
- PixiJS WebGL 2D rendering with procedural bird sprites, animated wings, and rider characters
- Flap-to-fly physics with gravity, platform collision, and horizontal screen wrap
- Lance-height combat system — higher jouster wins, loser drops an egg
- Egg lifecycle — collect for points or let them hatch into stronger enemies
- Three enemy tiers with wave-based progression: Bounder → Hunter → Shadow Lord
- Three game modes: Classic (waves), Survival (endless), and Versus (2P local PvP)
- Local 2-player support on one keyboard (Arrow keys + WASD)
- WebRTC peer-to-peer online multiplayer with BroadcastChannel signaling
- Player avatar selection with 4 character portraits (Brian, Les, Matt, Trent) plus generic option
- Bobblehead avatar rendering with movement bobble, triumph bounce, and anime-style death face (X eyes, O mouth)
- Retro "READY PLAYER 1" countdown with 3…2…1…FIGHT! and square-wave beep sound effects
- Particle effects on combat with screen shake on defeat
- Animated lava with flickering glow at the bottom of the arena
- Lives and respawn system (3 lives per game)
- localStorage leaderboard with persistent high scores across sessions
- Main menu with mode selection, leaderboard view, and player selection modal
- HUD displaying score, wave counter, and remaining lives

**Test Suite**
- 6 Vitest unit tests covering egg lifecycle and leaderboard persistence
- 18 Playwright end-to-end tests covering all 8 acceptance criteria
- TypeScript strict mode with clean typecheck

**Documentation & Licensing**
- Project README with skills workflow guide and getting started instructions
- Game README documenting gameplay mechanics, controls, and features
- Apache License 2.0 with LotZoom.com copyright
- CONTRIBUTING.md with contributor license agreement and code standards
- NOTICE file per Apache 2.0 requirements

[1.0.1]: https://github.com/jsnbuchanan/claude-code-spec-skills-example/releases/tag/v1.0.1
[1.0.0]: https://github.com/jsnbuchanan/claude-code-spec-skills-example/releases/tag/v1.0.0
