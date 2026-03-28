---
name: push-spec
description: >-
  Commits changes, pushes the branch, and opens a GitHub PR with title and body
  derived from the vault spec.
argument-hint: Optional PR title override
user-invocable: true
allowed-tools: [Glob, Read, Grep, Agent, Write, Edit, "Bash(git *)", "Bash(gh pr *)"]
---

# Push Spec

Commit, push, and open a PR whose body reflects the spec's Why/How/What and the actual diff.

## Inputs

- `$ARGUMENTS`: optional PR title override

## Execution Rules

- All 4 phases in order. Do not skip.
- Use conventional commit format (feat:, fix:, refactor:, chore:, etc.).

---

## Phase 1: Gather Context

1. `git branch --show-current` → derive slug (replace `/` with `--`)
2. Read `vault/specs/ready/{slug}/spec.md`
3. If no spec found → STOP: "No spec for slug `{slug}`."
4. In parallel:
   - `git diff --stat` + `git diff --cached --stat`
   - `git log ${BASE_BRANCH:-main}..HEAD --oneline`

## Phase 2: Commit

1. If nothing staged, `git add -A`
2. Determine conventional commit type from the diff
3. `git commit -m "{type}: {imperative summary}"` (72 char max subject)

## Phase 3: Compose PR

**Title:** `$ARGUMENTS` if provided, else `{type}: {concise summary}` (under 70 chars).

**Body:**

```markdown
## Why
{from spec — verbatim}

## How
{from spec — verbatim}

## What
{from spec — In Scope items}

## Changes
{from diff: files changed, key additions/removals}

## Testing
{from test results or spec's Feedback Harnesses section}

---
Spec: `vault/specs/ready/{slug}/spec.md`
```

## Phase 4: Push & Create PR

1. `git push -u origin {branch}`
2. `gh pr create --title "{title}" --body "{body}" --base ${BASE_BRANCH:-main}`
3. If spec exists, progress lifecycle:
   ```
   git mv vault/specs/ready/{slug}/ vault/specs/implemented/{slug}/
   ```
4. Commit + push vault updates: `chore: progress spec to implemented`
5. Report the PR URL
