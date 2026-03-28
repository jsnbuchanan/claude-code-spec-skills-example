# Spec Lifecycle

Specs progress through three stages in the vault:

| Stage | Path | Meaning |
|-------|------|---------|
| **draft** | `vault/specs/draft/{slug}/spec.md` | Discovery complete, not yet actionable |
| **ready** | `vault/specs/ready/{slug}/spec.md` | Approved for implementation |
| **implemented** | `vault/specs/implemented/{slug}/spec.md` | PR opened, spec fulfilled |

## Transitions

### Draft → Ready

Use `/promote-spec {slug}` — creates a branch, moves the spec, opens a PR, and merges it.

### Ready → Implemented (automatic)

Handled by `/push-spec` when the implementation PR is created.

## Next Steps After Drafting

1. **Promote** the spec to ready: `/promote-spec {slug}`
2. **Implement** the spec: `/implement-spec {slug}`
