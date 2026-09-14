# WMF Nuxt Project Guidelines

## Architecture

- This is a Nuxt 4 SPA (`ssr: false`) for Winnipeg Music Festival registration. The NestJS backend is the source of truth for authenticated and persisted data.
- Use Apollo GraphQL for backend communication. Authentication uses JWTs in httpOnly cookies; never store tokens in client-side state or storage.
- Use Pinia for client state and session persistence. Keep server mutations explicit, derive display state with computed values, and provide `$reset()` methods for stores that own temporary workflows.
- Registration forms are state-driven and composed from domain components. See the [registration forms skill](../.agents/skills/wmf-registration-forms/SKILL.md) for the workflow details.

## Source Of Truth

- Do not edit generated GraphQL output under `app/graphql/gql/`; update the schema or operations and run `pnpm codegen`.
- Keep authentication and authorization enforced by the backend. Client middleware and CASL improve UX but do not replace server checks.
- Follow the existing layout: `app/components/base/` for reusable form primitives, `app/components/form/` for registration sections, `app/components/admin/` for administration, and `app/stores/` for Pinia state.
- Use `<script setup lang="ts">`, explicit interfaces for public props and state, Tailwind CSS, and the `PV` prefix for PrimeVue components.

## Development

- The frontend runs on port `3001` and expects the GraphQL backend at `http://localhost:3000/graphql`. Start the backend from the sibling `wmf-nest` project when integration behavior is required.
- Common commands: `pnpm dev`, `pnpm build`, `pnpm lint`, `pnpm codegen`, `pnpm test`, and `pnpm test:e2e`.
- For authentication behavior, use the [authentication skill](../.agents/skills/wmf-authentication/SKILL.md). For tests, use the [testing skill](../.agents/skills/wmf-testing/SKILL.md) and the existing [testing guide](../tests/TESTING_GUIDE.md).

## Change Discipline

- Match nearby patterns and keep changes focused. Do not reformat unrelated files or modify generated artifacts.
- Add or update focused tests for behavior changes. Prefer existing unit, Nuxt, and Playwright fixtures over new test infrastructure.
- Preserve user-facing error feedback through the existing toast and error-handling patterns; do not silently swallow failures.
