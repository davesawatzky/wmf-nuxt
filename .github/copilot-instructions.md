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
pnpm test:e2e             # Playwright end-to-end tests
pnpm test:e2e:headed      # Playwright with browser UI
pnpm test:e2e:debug       # Playwright debug mode

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

## End-to-End Testing with Playwright

### Testing Architecture

The project uses **Playwright** for comprehensive E2E testing with a structured approach:

- **Multi-browser testing** (Chromium, Firefox, WebKit, Mobile Chrome)
- **Worker-scoped authentication** for parallel test execution
- **Page Object Model** pattern for maintainable test code
- **Authentication fixtures** for isolated user sessions

### Test Structure

```
tests/
├── e2e/                    # Playwright E2E tests
│   └── testPages.spec.ts   # Main test suite for user flows
├── pageObjects/            # Page Object Model implementation
│   ├── authPage.ts         # Authentication page actions
│   ├── helperBase.ts       # Base class with common utilities
│   └── pageManager.ts      # Centralized page object management
├── nuxt/                   # Nuxt-integrated tests (Vitest)
│   ├── components/         # Component testing with mount()
│   └── stores/             # Store testing with Pinia
├── unit/                   # Pure unit tests
│   └── utils/              # Utility function tests
├── setup.ts               # Comprehensive Nuxt test setup
├── setup-unit.ts          # Pure unit test setup
└── setup-simple.ts       # Minimal test setup
```

### Playwright Configuration

```
playwright/
├── .auth/                  # Pre-created authentication files
│   ├── user_1.json         # Test user credentials
│   ├── user_2.json         # Additional test accounts
│   └── user_3.json         # For parallel worker isolation
├── fixtures.ts            # Authentication fixtures and setup
└── report/                # Test execution reports
```

### Testing Patterns

#### Authentication Testing

- **Worker-scoped fixtures** ensure each parallel test has isolated auth state
- **Pre-created user accounts** in `.auth/*.json` files prevent test interference
- **httpOnly cookie authentication** matches production auth flow

#### Form Validation Testing

- **VeeValidate integration** requires proper field interaction patterns
- **Blur events** trigger field-level validation
- **Form submission** triggers comprehensive validation
- **Async validation timing** handled with appropriate timeouts

#### Page Object Model

```typescript
// Example usage pattern
const authPage = new AuthPage(page)
await authPage.shouldCheckForShortPassword('test@example.com', 'init', 'short')
```

### Key Testing Considerations

#### Backend Dependency

- Tests require **wmf-nest backend** running on `localhost:3000`
- GraphQL endpoints must be available for authentication flows
- **Network error simulation** via route blocking for resilience testing

#### VeeValidate Integration

- Field validation triggered by **blur events** or **form submission**
- **Reactive validation timing** requires proper await strategies
- **Email context** needed for password validation in multi-field forms

#### Authentication Flows

- **Route protection** tested via middleware redirection
- **Role-based access** validated through auth store integration
- **Session persistence** using httpOnly cookies

### Test Execution

```bash
# Run all E2E tests
pnpm test:e2e

# Run with browser UI for debugging
pnpm test:e2e:headed

# Debug specific test with breakpoints
pnpm test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/testPages.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

### Common Testing Scenarios

1. **Authentication flows** - login, validation, redirection
2. **Form validation** - VeeValidate error display and timing
3. **Route protection** - middleware-based access control
4. **User registration** - multi-step form completion
5. **Error handling** - network failures and user feedback

## Security Notes

- **No client-side JWT storage** - tokens stay in httpOnly cookies
- **Server-side validation** on every protected route
- **Role-based permissions** enforced both client and server-side
- **CORS** configured for development/production environments
