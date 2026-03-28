# External Integration Patterns

Reference file for implement-spec Phase 2 wrapper creation. Documents common patterns for integrating external services.

<!-- CUSTOMIZE: Replace the example inventory below with YOUR project's actual service wrappers.
     This file serves as a reference so the implement-spec skill knows how to follow
     your project's conventions when adding new external integrations. -->

## Service Wrapper Inventory (Example)

| Service | File | Env Var | Est. Cost/Call | Error Class | Availability Check | Pattern |
|---------|------|---------|---------------|-------------|-------------------|---------|
| Stripe | `lib/stripeService.ts` | `STRIPE_API_KEY` | ~$0.00 | `Stripe.errors.StripeError` | `isStripeConfigured()` | SDK singleton |
| OpenAI | `lib/openaiService.ts` | `OPENAI_API_KEY` | ~$0.01-0.15 | `OpenAI.APIError` | `isOpenAIConfigured()` | SDK singleton |
| SendGrid | `lib/emailService.ts` | `SENDGRID_API_KEY` | ~$0.001 | plain Error | `isEmailConfigured()` | Direct fetch |

## Key Patterns

### Direct Fetch (preferred for simple REST APIs)
- `headers()` helper with runtime env check
- Per-endpoint functions returning typed results
- Error classification: permanent (4xx) vs retryable (429, 5xx)
- Schema validation for request/response (e.g., Zod, io-ts, or equivalent)

### SDK Singleton (for SDK-based clients)
- `let _client: SDK | null = null` initialized on first call
- Getter function with env var check
- Useful when SDK manages connection pooling/auth

### Availability Check
All service wrappers should export an `is{Service}Configured()` function:
```typescript
export function isServiceConfigured(): boolean {
  return Boolean(process.env.SERVICE_API_KEY);
}
```
Used by tests (`describe.skipIf`) and runtime to gracefully degrade.

### Error Classification
- Permanent errors (400, 401, 402, 403, 404): client errors that won't succeed on retry
- Retryable errors (429, 5xx): transient failures, retry with backoff
- Custom error class enables callers to distinguish retry vs fail-fast

### Mock Testing
- Spy on `fetch` or SDK methods to intercept HTTP calls
- Validate request body shape, headers, URL
- Test both success and error response parsing
- Real API tests guarded with `describe.skipIf(!isServiceConfigured())`

### Cost Constant
```typescript
export const ESTIMATED_COST_PER_CALL = 0.05; // verified — https://service.com/pricing
```
Add when touching or creating services. Confidence: `verified` (public pricing) or `estimated`.

### Adding Endpoints to Existing Wrappers
Follow the existing file's conventions (schema naming, error class, headers helper). Add endpoint + tests (mock + `describe.skipIf` smoke). Don't refactor existing code.
