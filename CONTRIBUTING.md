# Contributing to Claude Code Spec-Driven Skills Example

Thank you for your interest in contributing. This project is licensed under the Apache License, Version 2.0, and all contributions are subject to its terms.

## How to Contribute

1. **Fork the repository** and create a feature branch from `main`.
2. **Make your changes** — add features, fix bugs, improve docs, or share your own spec-driven creation.
3. **Run the tests** to make sure nothing is broken:
   ```bash
   cd examples/spec-created-joust-game
   npm install
   npm run typecheck
   npm test
   npm run test:e2e
   ```
4. **Open a Pull Request** against `main` with a clear description of what you changed and why.

## Contributor License Agreement

By submitting a pull request or otherwise contributing to this project, you agree to the following:

- Your contribution is your original work, or you have the right to submit it.
- You grant the project maintainers and all recipients of the software a perpetual, worldwide, non-exclusive, no-charge, royalty-free, irrevocable copyright license to reproduce, prepare derivative works of, publicly display, publicly perform, sublicense, and distribute your contribution and any derivative works, under the terms of the Apache License, Version 2.0.
- You understand and agree that your contribution is public and that a record of the contribution, including your name and any other information you submit, is maintained indefinitely and may be redistributed consistent with the Apache License, Version 2.0.
- You are not expected to provide support for your contribution, except to the extent you desire to do so.

This is consistent with the [Apache Software Foundation contributor agreements](https://www.apache.org/licenses/contributor-agreements.html).

## Copyright and Headers

All new source files (`.ts`, `.js`, `.html`, etc.) must include the following copyright header as the first line:

```
// Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0.
```

For HTML files:

```
<!-- Copyright 2026 LotZoom.com. Licensed under the Apache License, Version 2.0. -->
```

Do not remove or alter existing copyright headers.

## Code Standards

- **TypeScript** — all source code must typecheck cleanly (`npx tsc --noEmit`).
- **Tests** — new features should include tests. Existing tests must continue to pass.
- **Commit messages** — keep them concise and focused on the change. No AI attribution trailers.
- **No secrets** — do not commit API keys, tokens, `.env` files, or credentials.

## Reporting Issues

Open a GitHub issue with a clear description of the problem, steps to reproduce, and expected vs actual behavior.

## Code of Conduct

Be respectful, constructive, and collaborative. We're all here to learn and build.

## Questions

If you're unsure about anything, open an issue or reach out. We'd rather answer a question than miss a contribution.
