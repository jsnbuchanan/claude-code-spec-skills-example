---
name: draft-spec
description: >-
  Drives Socratic discovery of the Golden Circle (why, how, what) with emphasis
  on feedback architecture — every acceptance criterion maps to an automated
  feedback loop. Produces a draft specification. Triggers: write a spec, new
  spec, draft spec, create spec, spec a feature.
argument-hint: Optional problem description or context to seed discovery
user-invocable: true
allowed-tools: [Glob, Read, Grep, Agent, AskUserQuestion, Write, Edit, WebSearch, WebFetch]
---

# Golden Spec

Surfaces the real problem (Why), functional solution (How), and feedback architecture (What) through Socratic questioning. Every AC must be provable by an automated feedback loop. Produces a spec — not an implementation plan.

## Inputs

- `$ARGUMENTS`: optional problem description or context to seed discovery

## Execution Rules

- Execute phases 0 → 6 in order (Phase 2 has sub-phases 2a/2b/2c/2d, Phase 3 has sub-phases 3a/3b — complete all sub-phases before advancing).
- Each Golden Circle phase (1–3) MUST gate on explicit user confirmation before advancing.
- NEVER write, edit, or create source files during this skill. This skill produces ONLY a spec.

---

## Phase 0: Inventory Existing Specs

Glob `vault/specs/**/spec.md` and display existing specs as context.

Ask if the user has visual assets (screenshots, mockups, diagrams). If yes, read each file path — Claude is multimodal. Track asset paths for persistence in Phase 5.

---

## Phase 1: Why — The User-Facing Problem

Surface the real problem through iterative questioning. If `$ARGUMENTS` provides context, seed the first question from it.

Ask via `AskUserQuestion` — one round at a time. Adapt follow-ups. Draw from:

- What pain or gap exists today?
- Who is affected and how severely?
- What happens if we do nothing?
- Is this a symptom of a deeper issue?

Converge on a **crisp problem statement** (1–2 sentences). Present it.

**Gate:** Confirm the Why before proceeding. If refined, update and re-confirm.

## Phase 2a: How — The Functional Solution

Given the confirmed Why, explore the functional solution. Ask iteratively:

- What does the ideal outcome look like?
- What constraints exist? (technical, time, dependencies)
- What approaches could solve this? (present 2–3 if ambiguous)
- What trade-offs does each approach carry?

Converge on a **solution statement** naming the chosen approach and key trade-offs.

**Gate:** Confirm the solution statement before proceeding.

## Phase 2b: How — Scope

Define boundaries before writing ACs. Scope constrains what ACs get written.

Derive from the solution statement:
- **In Scope** — capabilities this spec delivers
- **Out of Scope** — related capabilities explicitly excluded (and why)

Present both lists. Iterate.

**Gate:** Confirm scope before proceeding.

## Phase 2c: How — Acceptance Criteria

Synthesize 3–8 draft ACs from the confirmed solution and scope. Only cover in-scope capabilities. Format:

> **AC-{N}:** **Given** [context], **When** [action], **Then** [observable outcome]

**ACs describe what the system does, not how it's built.** Each must be verifiable by observing behavior (UI, API response, data output, system state) without reading source code. Implementation details belong in **What**.

### Verifiability Gate

Every AC must be provable by automated feedback. For each AC, determine the highest-fidelity verification strategy available:

**Fidelity hierarchy** (prefer higher; justify moving down):
1. **Live** — real service interaction: run mutations/queries against a running backend, browser automation (e.g. Playwright) against a live app, Docker health checks, actual API calls with real keys
2. **Integration** — multiple real components composed, mocks only at true external boundaries (third-party APIs without test environments)
3. **Isolated** — single-unit tests with mocks (use only when higher fidelity is impossible or wasteful for the AC)

For each AC, confirm at least one automated verification applies. If only human-verifiable: sharpen the outcome until machine-assertable, or split into a functional AC + design review note. Exception: genuine human sensory judgment — mark `[manual]` with justification.

**Anti-patterns:**
- Mocking the thing you're trying to verify (e.g., mocking a database query to test that query's behavior)
- Defaulting to isolated unit tests when live verification is available and cheap
- Over-mocking internal boundaries — only mock true external services
- Testing implementation details instead of observable outcomes

Anti-patterns (code-level ACs):
- "Then `resolveThumbnailUrl()` helper is added to the query layer"
- "Then `thumbnailSmallStorageId` field is populated on the document"

Good patterns (functional):
- "Then thumbnails display in the listing card within 200ms"
- "Then the API returns paginated results sorted by date"

**Self-check:** each AC could be validated by a QA tester with no source access, and maps to the highest feasible fidelity level.

Present draft ACs. Iterate.

**Gate:** Confirm ACs before proceeding.

## Phase 2d: How — User Flows

Propose key user flows from the confirmed solution + ACs:

- **Happy path**: primary success scenario
- **Error/edge states**: 1–2 failure or boundary scenarios

Each flow is a short numbered-step narrative. Present and iterate.

**Gate:** Confirm user flows before proceeding.

## Phase 3a: What — Feedback Architecture

For each confirmed AC, design the automated feedback harness that proves it — starting from the highest-fidelity verification available.

1. Use `Agent` (subagent_type: Explore) to survey:
   - Existing test patterns and reusable infrastructure in the project (search for `*.test.ts`, `*.spec.ts`, `e2e/`, `tests/`, `__tests__/`)
   - **Available dev capabilities at implementation time** — adapt to YOUR stack. Examples:
     - Backend dev server (local) — CLI can invoke mutations/queries directly
     - Frontend dev server (local)
     - Browser automation (e.g. Playwright, Cypress) against live services
     - Docker daemon — can build and run container images locally
     - Secrets manager — real API keys available for external services
   - Assess: which ACs can be verified **live** (against running backend, browser against running app) vs. which genuinely require isolated mocks?

2. For each confirmed AC, fill one row:

| Column | Definition |
|--------|-----------|
| **AC** | Reference (AC-1, AC-2, ...) |
| **Fidelity** | `live` / `integration` / `isolated` — highest feasible level from the hierarchy. Justify if not `live`. |
| **Layer(s)** | `backend` / `frontend` / `e2e` / `external:{service}` (can be multi) — which test runner executes |
| **Trigger** | What initiates the feedback loop (CLI command, browser navigation, user gesture, health check) |
| **Observable Seam** | What to inspect (query return value, DOM element, page screenshot, CLI output, HTTP response) |
| **Terminal Condition** | Concrete assertion proving the AC passed |
| **Test Infra** | `exists — {what}`, `partial — {exists / missing}`, or `new — {what to build}` |

3. **Fidelity justification rule:** If an AC is marked `isolated` but the Observable Seam could be checked via a CLI command or browser automation against a live backend, the AC MUST be promoted to `live` or `integration`. Document why if demotion is necessary (e.g., "requires third-party webhook callback that cannot be triggered in dev").

4. **External port rows:** When an AC depends on an external service, add an `external:{service}` row. Trigger = internal call site. Observable Seam = request shape + response schema. Terminal Condition = valid response parsed, or error correctly classified.

5. **System boundaries:** Note which modules/files each harness touches.

6. **Completeness check:** Every AC must have at least one automated row. If unmappable, loop back to Phase 2b to rewrite.

7. **`[manual]` exception:** Fidelity = `manual` with justification for why automation is impossible.

8. **Derive System Boundaries** from the feedback table — modules, services, and integration points touched.

Present the feedback table and system boundaries.

**Gate:** Confirm feedback architecture before proceeding.

## Phase 3b: Dependency Scan

Identify external dependencies. Skip if none needed.

1. **Inventory** — look for existing service wrappers, API clients, or SDK integrations in your project. For each:
   - Service name, specific endpoint/function needed, env var
   - Integration status at endpoint granularity:
     - `existing` = wrapper + needed endpoint already wired
     - `partial — {exists / missing}` = wrapper exists, endpoint not wired
     - `new — {what to build}` = no wrapper
   - **Env var**: read from wrapper's config or availability check (existing), or derive from convention (new)

2. **Cost discovery** (only interactive opportunity before autonomous implementation):
   - Existing: read cost estimates from wrapper if available
   - New: WebSearch for public pricing. If unavailable, ask the user
   - Per dependency: confirm per-call estimate and test budget

3. **Budget guidance** defaults:
   - Free: no budget | Cheap (<$0.10/call): $2.00 | Expensive (>=$0.10/call): $5.00 | Unknown: $5.00

Present dependency inventory.

**Gate:** Confirm dependencies before proceeding.

## Phase 4: Slug Generation

1. Generate 5 candidate slugs — five-word kebab-case (e.g. `real-time-chat-message-sync`)
2. Glob `vault/specs/**/spec.md`, check for collisions
3. Mutate colliding slugs
4. Present candidates

**Gate:** User picks or provides a slug.

## Phase 5: Write to Vault

Write to `vault/specs/draft/{slug}/spec.md`:

```markdown
---
slug: {slug}
created: {YYYY-MM-DD}
tags: [spec, golden-circle]
---
# {Title derived from slug}

## Why
{confirmed problem statement}

## How
{confirmed solution statement}

### In Scope
{bulleted list}

### Out of Scope
{bulleted list}

### Acceptance Criteria
- [ ] **AC-1:** **Given** {context}, **When** {action}, **Then** {outcome}
- [ ] **AC-2:** ...

### User Flows

**Happy Path:** {flow name}
1. {step}
2. {step}
...

**Error: {scenario name}**
1. {step}
2. {step}
...

## What

### System Boundaries
{bulleted list of modules, services, integration points}

### Feedback Harnesses

Every AC has an automated feedback loop. Manual feedback is exceptional and justified.

| AC | Fidelity | Layer(s) | Trigger | Observable Seam | Terminal Condition | Test Infra |
|----|----------|----------|---------|-----------------|-------------------|------------|
| AC-1 | {live/integration/isolated} | {layer} | {trigger} | {seam} | {assertion} | {infra} |

<!-- Feedback Harness column definitions:
- Fidelity: live = real service interaction (CLI against backend, browser automation + live backend, Docker, real APIs). integration = multiple real components, mocks only at true external boundaries. isolated = unit tests with mocks (justify why higher fidelity is infeasible). manual = human-only (justify).
- Layer(s): backend (your backend test runner), frontend (your frontend test runner), e2e (browser automation), external:{service} = contract test
- Trigger: what initiates the feedback loop
- Observable Seam: observable behavior to inspect (not source code)
- Terminal Condition: concrete assertion proving the AC passed
- Test Infra: exists / partial / new — describe what covers or is missing -->

### External Dependencies
<!-- Omit this section if no external services are needed -->

| Service | Functionality In Scope | Integration Status | Env Var | Est. Cost/Call | Test Budget (total) |
|---------|----------------------|-------------------|---------|---------------|---------------------|
| {name} | {what this feature uses} | existing / partial — {gap} / new — {what to build} | `{ENV_VAR}` | ${N.NN} or Unknown | ${ceiling} |

<!-- Column definitions:
- Integration Status: existing = wrapper + endpoint wired. partial — describe what exists / what's missing. new — describe what to build.
- Env Var: environment variable name. For existing wrappers, read from config/availability check. For new, use convention.
- Est. Cost/Call: Free = $0. Cheap < $0.10. Expensive >= $0.10. Unknown when pricing requires auth.
- Test Budget (total): Dollar ceiling for ALL real API calls during implementation + testing. -->

<!-- Reference assets with ![description](assets/filename.png) -->
```

If assets were collected in Phase 0, copy to `vault/specs/draft/{slug}/assets/` and insert image references in the appropriate spec section.

## Phase 6: Handback

Present the full spec with vault file path. Note binary assets live in `vault/specs/draft/{slug}/assets/` (Git LFS).

If spec has `### External Dependencies` with `new` or `partial` entries, list env vars to provision:

> **Before implementing**, set these env vars in your project's environment configuration.
> Without these, `/implement-spec` falls back to mock-only mode.

Suggest next steps from `LIFECYCLE.md`:
1. **Provision env vars** (if any)
2. **Promote** draft to ready: `/promote-spec {slug}`
3. **Implement**: `/implement-spec {slug}`
