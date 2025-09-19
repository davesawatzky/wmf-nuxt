# AI Agent Instructions for WMF Nuxt

## Architecture Overview

This is a **Nuxt 4 SPA** for Winnipeg Music Festival registration with a **NestJS backend** (`wmf-nest`). The frontend is stateless and uses **httpOnly JWT cookies** for authentication.

### Key Architectural Decisions

- **SPA mode** (`ssr: false`) - pure client-side application
- **GraphQL-first** - all backend communication via Apollo Client
- **Session-based auth** - JWT tokens in httpOnly cookies, validated server-side
- **State-driven forms** - complex multi-step registration forms with auto-save
- **Role-based access** - CASL + custom auth store for granular permissions

## Critical Patterns

### Authentication Flow

```typescript
// Auth middleware validates on every route
// app/middleware/auth.ts checks httpOnly cookie via GraphQL
query TokenCheck {
  tokenCheck {
    user { id, email, roles, permissions, isActive }
    userErrors { message }
  }
}
```

The auth system uses **dual store pattern**:

- `usePrivateState()` - internal state that can't be directly accessed
- `useAuthStore()` - public interface with readonly computed properties
- User roles are **immutable** once set to prevent client-side tampering

### Form Architecture

Multi-step registration forms use:

- **Dynamic component loading** based on `performerType` (solo, group, school, community)
- **Auto-save** via `useStorage` with sessionStorage persistence
- **Validation** with VeeValidate + Yup schemas
- **State synchronization** between multiple stores (registration, classes, performers)

Example form flow:

```typescript
// app/pages/Form.vue dynamically loads components
const tabs = {
  solo: [FormSoloPerformer, FormSoloTeacher, FormTypeClasses, Summary],
  group: [
    FormGroupInfo,
    FormGroupPerformers,
    FormGroupTeacher,
    FormTypeClasses,
  ],
  // ...
}
```

### Store Patterns

Stores follow a **mutation-only pattern** for data integrity:

- GraphQL mutations for server state
- Computed properties for derived state
- Explicit `$reset()` methods for cleanup
- Store composition (e.g., registration store uses classes store)

### Component Conventions

- **Base components** (`app/components/base/`) are form primitives with validation
- **Form components** (`app/components/form/`) are domain-specific sections
- **Admin components** (`app/components/admin/`) for management interfaces
- All use `<script setup>` with TypeScript

## Development Workflows

### Essential Commands

```bash
# Development with backend connection
pnpm dev                    # Port 3001, connects to localhost:3000 GraphQL

# Code generation (run after GraphQL schema changes)
pnpm codegen               # Generates types from schema.gql

# Testing
pnpm test                  # Vitest with happy-dom
pnpm test:watch           # Watch mode

# Linting (strict TypeScript + Vue rules)
pnpm lint                 # ESLint with custom rules
pnpm lint:fix             # Auto-fix issues
```

### Backend Dependency

**Critical**: This app requires `wmf-nest` backend running on `localhost:3000`. GraphQL endpoint is hardcoded in `nuxt.config.ts`. The app will fail without backend connectivity.

## Integration Points

### GraphQL Integration

- **Apollo Client** with cookie-based auth
- **Code generation** from `app/graphql/schema.gql`
- **Proxy cookies** enabled for SSR compatibility
- **No-cache** policy for fresh data on auth operations

### External Services

- **Stripe** for payments (`@stripe/stripe-js`)
- **Email services** via server routes (`/api/send-email`)
- **PDF generation** with pdfmake
- **Image optimization** via Nuxt Image

### State Management

- **Pinia** with session storage persistence
- **Composables** for reusable logic (`app/composables/`)
- **Middleware** for route protection and data loading

## Project-Specific Conventions

### TypeScript Strictness

- **Strict mode** enabled with explicit typing
- **Generated types** from GraphQL schema (never edit `gql/` directory)
- **Interface definitions** for all props and state

### Styling Approach

- **Tailwind CSS** with custom WMF preset
- **PrimeVue** components with `PV` prefix
- **Responsive design** with mobile-first approach

### File Organization

```
app/
├── components/           # Vue components by domain
├── composables/         # Reusable composition functions
├── graphql/            # GraphQL schemas and generated types
├── middleware/         # Route protection and auth
├── pages/              # File-based routing
├── stores/             # Pinia stores for state management
└── utils/              # Pure utility functions
```

### Error Handling

- **Try-catch** in auth operations with navigation fallbacks
- **Toast notifications** for user feedback
- **Console logging** for debugging (consider structured logging)

## Testing Considerations

- **Vitest** with Nuxt integration
- **Happy-dom** environment for component testing
- **Store tests** for business logic validation
- Mock GraphQL operations for isolated testing

## Security Notes

- **No client-side JWT storage** - tokens stay in httpOnly cookies
- **Server-side validation** on every protected route
- **Role-based permissions** enforced both client and server-side
- **CORS** configured for development/production environments
