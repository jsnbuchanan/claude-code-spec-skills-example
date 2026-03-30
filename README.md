# Claude Code Spec-Driven Skills Example

Brian, Les, Matt, and Trent — thank you for showing up on Saturday. I genuinely mean that. Your presence in the Claude Code class wasn't just attendance; it was the kind of engaged, thoughtful participation that made the session better for everyone in the room, including me. The questions you asked cut right to the heart of real problems. The feedback you offered was honest and sharpened my own thinking. I walked away having gained more from your insights than I expected to give, and that's the best kind of exchange.

If you hit a wall, have a question, or just want to think through an idea out loud — I'm a phone call away. No hesitation needed. I'd also love to set up a standing weekly office hours with each of you. Whatever I can do to multiply your success, it would be a genuine pleasure. Your wins are my wins, and helping you find them is exactly where I want to spend my time.

---

## What's in this repo

This repository demonstrates a **spec-driven development workflow** powered by Claude Code custom skills. Four skills work together to take you from a rough idea to a tested, shipped implementation — with structure, feedback loops, and quality gates at every step.

The result? A fully playable browser-based Joust game, built from nothing but a single prompt. See it in action in [`examples/spec-created-joust-game/`](examples/spec-created-joust-game/).

## The Skills

| Skill | What it does |
|-------|-------------|
| `/draft-spec` | Guides Socratic discovery of the problem, solution, and acceptance criteria — producing a structured spec with automated feedback harnesses |
| `/promote-spec` | Moves a draft spec to ready status via a branch and PR, gating on review before implementation begins |
| `/implement-spec` | Autonomously writes failing tests from the spec's ACs, implements the solution to make them pass, and enforces spec alignment through review loops |
| `/push-spec` | Commits, pushes, opens a PR with the spec's Why/How/What, and progresses the spec lifecycle to implemented |

## Getting Started

**1. Get the skills**

Download [spec-workflow-skills.zip](.claude/skills/spec-workflow-skills.zip) and extract, or copy the four skill directories from [`.claude/skills/`](.claude/skills/) into your own project's `.claude/skills/` folder. You'll also want to create a `vault/specs/` directory structure for spec lifecycle management:

```
your-project/
  .claude/
    skills/
      draft-spec/
      promote-spec/
      implement-spec/
      push-spec/
  vault/
    specs/
      draft/
      ready/
      implemented/
```

**2. Learn the workflow**

Open [How to use these skills.pdf](.claude/skills/How%20to%20use%20these%20skills.pdf) for a detailed walkthrough of the full spec lifecycle — from drafting your first spec through implementation and delivery.

**3. Try it**

Start Claude Code in your project and type:

```
/draft-spec I want to build [your idea here]
```

The skill will walk you through the discovery process. When your spec is ready:

```
/promote-spec your-spec-slug
/implement-spec your-spec-slug
/push-spec
```

## Example: Retro Joust Battle Arena

The [`examples/spec-created-joust-game/`](examples/spec-created-joust-game/) directory contains a complete browser game built using this workflow. It includes the full game source, 24 passing tests (unit + e2e), and a [README](examples/spec-created-joust-game/README.md) documenting the journey.

```bash
cd examples/spec-created-joust-game
npm install
npm run dev
```

## Your Turn

Show us what you're working with. Use these skills to go from idea to implementation on your own project — then submit a Pull Request with your creation. Successes, failures, and "meh" stories are all welcome. That's how we learn what these tools can actually do.
