# Agent Instructions

Full project guidelines live in [.github/copilot-instructions.md](.github/copilot-instructions.md) — read that file for architecture, conventions, and change discipline. This file is a pointer for tools that only look for `AGENTS.md`.

## Quick Reference

- Dev server: `pnpm dev` (runs on port 3001, expects the GraphQL backend at `http://localhost:3000/graphql` from the sibling `wmf-nest` project)
- Build: `pnpm build`
- Lint: `pnpm lint`
- Codegen: `pnpm codegen` (never hand-edit generated output under `app/graphql/gql/`)
- Unit/component tests: `pnpm test`
- E2E tests: `pnpm test:e2e`
