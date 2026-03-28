---
name: promote-spec
description: >-
  Promotes a draft spec to ready — creates a branch, moves the spec,
  opens a review PR, and rebase-merges it.
argument-hint: Optional slug — defaults to most recent draft
user-invocable: true
allowed-tools: [Glob, Read, Grep, AskUserQuestion, "Bash(git *)", "Bash(gh pr *)"]
---

# Promote Spec

Moves a spec from `vault/specs/draft/` to `vault/specs/ready/`, wrapped in a branch + PR for traceability.

## Inputs

- `$ARGUMENTS`: optional slug of the draft spec to promote

## Execution Rules

- Execute phases 1 → 4 in order.
- NEVER create or edit spec content. This skill only moves files.
- Phase 4 MUST gate on explicit user confirmation before merging.

---

## Phase 1: Resolve Slug

1. If `$ARGUMENTS` is provided, use it as the slug.
2. Otherwise, glob `vault/specs/draft/*/spec.md` and pick the most recently modified file. Extract the slug from the path.
3. Verify `vault/specs/draft/{slug}/spec.md` exists. If not, report error and stop.
4. Verify `vault/specs/ready/{slug}/` does NOT already exist. If it does, report error and stop.
5. Read spec content for use in the PR body.

## Phase 2: Branch & Commit

1. Verify working tree is clean (`git status --porcelain`). If dirty, report and stop.
2. `git checkout -b spec/{slug}`
3. `git mv vault/specs/draft/{slug}/ vault/specs/ready/{slug}/`
4. `git commit -m "chore: promote {slug} to ready"`

## Phase 3: Push & PR

1. `git push -u origin spec/{slug}`
2. Simply reference the spec file in the PR body
3. `gh pr create --title "spec: promote {slug} to ready" --body "{body}" --base main`
4. Report the PR URL.

## Phase 4: Merge & Return

**Gate:** Ask user to confirm before merging.

1. `gh pr merge --rebase --delete-branch`
2. `git checkout main && git pull origin main`
3. Report: spec promoted to `vault/specs/ready/{slug}/`.
4. Suggest next step: `/implement-spec {slug}`
