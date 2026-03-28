---
name: implement-spec
description: >-
  Orchestrates autonomous feedback loop driven implementation from a ready spec — writes a
  failing feedback harness from spec ACs, then implements the solution to
  make tests pass, with delegated planning and integrated review loops. Triggers: implement,
  code from spec, build spec, execute spec.
argument-hint: "Five-word kebab-case spec slug (e.g. real-time-chat-message-sync)"
user-invocable: true
allowed-tools: [Glob, Read, Write, Edit, Grep, Agent, WebSearch, WebFetch, "Bash(git *)", "Bash(gh pr *)", "Bash(gh issue *)"]
---

<!-- CUSTOMIZATION REQUIRED
     This skill uses placeholder commands that you MUST adapt to your stack.
     Search for "CUSTOMIZE:" comments and replace with your project's commands.

     Common adaptations:
     - Test runner commands (e.g., npm test, pytest, cargo test)
     - Type-check commands (e.g., npx tsc --noEmit, mypy)
     - Lint/format commands (e.g., npx eslint --fix, ruff format)
     - Dev server commands (e.g., npm run dev, python manage.py runserver)
     - Database CLI commands (e.g., prisma db push, rails db:migrate)
-->

# Implement Spec

## Inputs

- `$ARGUMENTS`: spec slug (required)

## Execution Rules

- Execute all phases in order.
- The skill is fully autonomous — no user gates.
- All spawned agents MUST respond using their named YAML template from `reference/agent-response-templates.md`. No prose — YAML only.

### Progress Tracking

If `issueNumber` is available: post a concise comment to the GitHub issue, after completing each sub phase (e.g. 1a , 2b, etc) / iteration.

```
gh issue comment {issueNumber} --body "Phase {X}{Y} (iteration {Z}): {one-line outcome}"
```

## STOP Procedure

On terminal failure, execute these steps in order:

1. **Commit** — commit any uncommitted changes `chore: save progress before stop ({reason})`
2. **Push** — push any unpushed commits, `git push -u origin HEAD`
3. **Comment** — if `issueNumber` is available, post a catastrophic failure comment using `:rotating_light:` prefix:
   ```
   gh issue comment {issueNumber} --body ":rotating_light: Phase {N}: {phase name} — BLOCKED: {reason}

   **Impact:** {what capability is lost}
   **Resolution:** {what the human needs to do}"
   ```
4. **Halt** — stop execution entirely.

## CHECKS Procedure

Spawn agent w/ haiku - `checks` template to:
<!-- CUSTOMIZE: Replace with your project's lint and typecheck commands -->
1. Run lint/format fix (e.g., `npm run lint:fix`, `npx biome check --fix`)
2. Run type-check (e.g., `npx tsc --noEmit`, `mypy .`)

## Phase 0: Pre-check

1. If `$ARGUMENTS` is empty, print usage and → **STOP Procedure** (reason: "no slug provided"):
   ```
   Usage: /implement-spec {slug}
   Example: /implement-spec real-time-chat-message-sync
   ```
2. Read `vault/specs/ready/$ARGUMENTS/spec.md`
3. If not found: **STOP Procedure** (reason: "spec not found in ready/")
4a. Parse the spec: extract **Why**, **How**, **What** and all sub sections. Track external dependencies and the feedback harness — for each AC identify `fidelity` (`live` / `integration` / `isolated`) and `layer` (`backend` / `frontend` / `e2e` / `external`). If the spec lacks a Fidelity column, default to `isolated`.
4b. Scan `spec.md` for asset references (markdown image syntax `![…](assets/…)`) and load into context.
4c. For each external dependency with status `new` or `partial`:
   1. identify the `envVar`
   2. check if the env var is set in your project's environment
   3. if missing **STOP Procedure** (reason: "missing external env vars", comment body: list all missing vars with resolution steps)
5. Resolve `issueNumber`: read `$ISSUE_NUMBER` env var. If absent or empty, `issueNumber` is null (progress comments will be skipped).

## Phase 1: Feedback Harness

### 1a. Code Harness

Follow the spec to create the feedback harness, in the following order by layer:
1. external
2. backend
3. frontend
4. e2e

For each layer, apply the AC's fidelity to determine the harness strategy:
- **live**: Test interacts with running services. Backend → CLI invocations or test client against dev server. E2E → browser automation against running app + live backend. The test MUST NOT mock the component under verification.
- **integration**: Test composes multiple real internal components. Mock only at true external boundaries (third-party APIs). Backend → test runner calling real functions with mocked external fetch.
- **isolated**: Standard unit test with mocks. Use only when the spec justifies it (default for specs without a Fidelity column).

For each layer:
1. spawn agent w/ sonnet to verify that tests FAIL meaningfully — `test-fail` template
2. **CHECKS procedure**
3. fix & verify check failures
4. Commit: `harness: {concise 1 sentence summary}`

### 1b. Review Harness

For each layer that exists in the harness spawn a reviewer agent in parallel — `review-harness` template:
1. Identify any harness gaps with the spec.
2. Identify any harness misalignments with the spec.
3. Rank spec alignment 0-10.
4. Check for real bugs.

A score below 9 requires iteration on the harness, with 5 max harness iterations.
Use the the **STOP Procedure** after max attempts.

## Phase 2: External Dependencies

<!-- CUSTOMIZE: This phase handles external API integrations.
     If your project has no external service dependencies, this phase is skipped.
     Adapt the mock/toggle pattern to your project's conventions. -->

If the spec has external dependencies with status `new` or `partial`:

### 2a. Research External APIs

For each external dependency spawn a research agent (w/ sonnet model - `research-external` template) to:
1. Find the most authoritative API documentation source if none provided in the spec.
2. Search exhaustively to identify the most relevant API spec per endpoint with 95%+ confidence.

If unable to find required information, execute **STOP Procedure**.

### 2b. Code External Integrations

For each external dependency with status `new` or `partial`:
1. Exercise the real endpoint with API key to verify connectivity.
2. Capture the request / response shape for mock fixtures.
3. Implement the service wrapper following your project's conventions.

After writing:
1. spawn agent w/ sonnet to verify that tests PASS meaningfully — `test-pass` template
2. **CHECKS procedure**
3. fix & verify check failures
4. Commit: `external: {concise 1 sentence summary}`

### 2c. Review External Integrations

For each external dependency spawn a reviewer agent in parallel — `review-mocks` template:
1. Identify any gaps with the spec.
2. Identify any misalignments with the spec.
3. Rank spec alignment 0-10.
4. Check for real bugs.

A score below 9 requires iteration, with 5 max iterations.
Use the the **STOP Procedure** after max attempts.

## Phase 3: Solution

### 3a. Code Solution

Following the spec and using the feedback harness, write the solution in the following order by layer:
1. external
2. backend
3. frontend
4. e2e

Apply the same fidelity dispatch as Phase 1a — `live` fidelity means the passing tests verify against real running services, not mocked substitutes.

For each layer:
1. spawn agent w/ sonnet to verify that tests PASS meaningfully — `test-pass` template
2. **CHECKS procedure**
3. fix & verify check failures
4. Commit: `solution: {concise 1 sentence summary}`

### 3b. Review Solution

For each layer that exists in the solution spawn a reviewer agent in parallel — `review-solution` template:
1. Identify any solution gaps with the spec.
2. Identify any solution misalignments with the spec.
3. Rank spec alignment 0-10.
4. Check for real bugs.

A score below 9 requires iteration on the solution, with 5 max solution iterations.
Use the the **STOP Procedure** after max attempts.

## Phase 4: Push

Invoke `/push-spec` — it handles pushing, PR creation, spec lifecycle progression, and vault status update.

## Appendix: Fidelity Map

Prefer higher-fidelity tools when the AC's fidelity level permits:

<!-- CUSTOMIZE: Replace this table with YOUR project's dev capabilities -->

| Capability | Example Command | Fidelity | Use |
|------------|----------------|----------|-----|
| Backend dev server | `npm run dev` | live | Live backend, hot-reload, real data |
| Backend CLI | `npx prisma db execute`, `rails console` | live | Direct queries against running backend |
| Frontend dev server | `npm run dev` | live | Dev server for browser automation |
| Browser automation | `npx playwright test` | live | Browser automation against running app + live backend |
| Docker | `docker build` / `docker run` | live | Build and run container images locally |
| Backend test runner | `npm test` (Jest/Vitest/pytest) | integration/isolated | Backend unit/integration tests |
| Frontend test runner | `npm test` (Jest/Vitest) | isolated | Frontend component tests |

Run `npx playwright install chromium` before E2E tests. If dev servers are unreachable when E2E tests are required → **STOP Procedure**.
