# Agent Response Templates

All spawned agents MUST respond using the YAML template for their role. Omit keys with empty lists. No prose — YAML only.

---

## `checks` — CHECKS Procedure

```yaml
status: pass | fail
failures:
  - tool: lint | typecheck
    file: path/to/file.ts
    line: 42
    message: "Type 'string' is not assignable to type 'number'"
```

- Omit `failures` when `status: pass`.

---

## `test-fail` — Verify Harness Fails

```yaml
status: failing | not-failing
layer: backend | frontend | e2e | external
fidelity: live | integration | isolated  # optional, defaults to isolated
tests:
  - name: "should reject invalid input"
    result: fail | pass | error
    message: "Expected error not thrown"
```

- Every test listed. `message` only when `result` is not `fail`.
- `status: not-failing` → harness needs fixing (tests unexpectedly passed).
- `fidelity` reflects how the harness interacts with services (live = real running services, not mocks).

---

## `test-pass` — Verify Tests Pass

```yaml
status: passing | not-passing
layer: backend | frontend | e2e | external
fidelity: live | integration | isolated  # optional, defaults to isolated
issues:
  - name: "should create task via API"
    result: fail | error
    message: "Connection refused on endpoint"
```

- Omit `issues` when `status: passing`.
- `fidelity` reflects how the tests interact with services.

---

## `review-harness` — Spec Alignment Review

```yaml
layer: backend | frontend | e2e | external
fidelity: live | integration | isolated  # optional, defaults to isolated
score: 9
deficiencies:
  - type: gap | misalignment | fidelity-downgrade
    ac: "AC-3: validates input schema"
    detail: "Missing negative case for empty payload"
bugs:
  - file: tests/example.test.ts
    line: 87
    detail: "Assertion checks wrong field — compares `id` instead of `_id`"
```

- `score` 0–10. Below 9 → iteration required.
- Omit `deficiencies` / `bugs` when empty.
- `fidelity-downgrade` deficiency type: harness uses lower fidelity than the spec prescribes (e.g., mocking a database query when spec says `live`).

---

## `review-mocks` — Spec Alignment Review

```yaml
layer: external
service: example-service
score: 8
deficiencies:
  - type: gap | misalignment
    endpoint: createResource
    detail: "Mock missing error response for 429 rate limit"
bugs:
  - file: services/example/wrapper.ts
    line: 23
    detail: "Response schema allows null but mock always returns string"
```

---

## `review-solution` — Spec Alignment Review

```yaml
layer: backend | frontend | e2e | external
fidelity: live | integration | isolated  # optional, defaults to isolated
score: 9
deficiencies:
  - type: gap | misalignment | fidelity-downgrade
    ac: "AC-2: persists record"
    detail: "Mutation writes but doesn't index by userId"
bugs:
  - file: src/api/create.ts
    line: 34
    detail: "Race condition — read-then-write without transaction lock"
```

- Same shape as `review-harness`. Uniform gating: score < 9 → iterate.

---

## `research-external` — API Doc Discovery

```yaml
service: example-service
confidence: 0.97
endpoints:
  - name: createResource
    method: POST
    path: /v2/resources
    auth: Bearer
    request:
      required: [title, owner_id]
      optional: [description, due_date, priority]
    response:
      success: { status: 201, body: "{ id, title, status, created_at }" }
      errors: [400, 401, 429]
    source: "https://docs.example.com/api/v2#create-resource"
```

- `confidence` < 0.95 → STOP Procedure.
- `source` provides provenance for mock validation.
