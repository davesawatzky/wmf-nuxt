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

The project uses **Playwright** for comprehensive E2E testing with:

- **Multi-browser testing** (Chromium, Firefox, WebKit, Mobile Chrome)
- **Page Object Model** for maintainable, reusable test code
- **Authentication helpers** for quick test setup
- **Worker-scoped fixtures** for parallel test execution
- **MailHog integration** for email verification testing

### Test Structure

```
tests/
├── e2e/ # Playwright E2E tests
│ ├── authentication.example.spec.ts # Example authentication test suite
│ └── testPages.spec.ts # Existing test suite
├── pageObjects/ # Page Object Model implementation
│ ├── helperBase.ts # Base class with common utilities
│ ├── loginPage.ts # Login/registration page actions
│ ├── emailConfirmationPage.ts # Email verification flows
│ ├── passwordResetPage.ts # Password reset flows
│ ├── registrationsPage.ts # Main authenticated page
│ ├── pageManager.ts # Centralized page access
│ └── index.ts # Exports
├── helpers/ # Reusable test utilities
│ ├── authHelper.ts # Authentication and MailHog helpers
│ └── index.ts # Exports
├── nuxt/ # Nuxt-integrated tests (Vitest)
│ ├── components/ # Component testing
│ └── stores/ # Store testing
├── unit/ # Pure unit tests
│ └── utils/ # Utility tests
├── TESTING_GUIDE.md # Comprehensive testing documentation
├── setup.ts # Comprehensive Nuxt test setup
├── setup-unit.ts # Pure unit test setup
└── setup-simple.ts # Minimal test setup
```

### Playwright Infrastructure

```
playwright/
├── .auth/ # Authentication files
│ ├── test-accounts.json # 5 pre-configured test users
│ └── *.json (generated) # Worker authentication states
├── fixtures.ts # Worker-scoped authentication fixtures
├── README.md # Fixture documentation
└── report/ # Test execution reports

specs/
├── authentication-test-plan.md # Comprehensive test scenarios (50+)
└── authentication-implementation-summary.md # Implementation overview
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

#### Page Object Model Usage

```typescript
import { PageManager } from '../pageObjects/pageManager'

test('sign in example', async ({ page }) => {
  const pm = new PageManager(page)

  await pm.loginPage.goto()
  await pm.loginPage.signIn('user@example.com', 'Password123!')
  await pm.loginPage.verifySuccessfulSignIn()
})
```

#### Authentication Helper Usage

```typescript
import { AuthHelper, TEST_USERS } from '../helpers/authHelper'

test('quick authentication', async ({ page }) => {
  // Sign in with pre-defined test user
  await AuthHelper.signInAsUser(page, 'REGULAR_USER')

  // Or custom credentials
  await AuthHelper.signIn(page, 'user@example.com', 'Password123!')
})
```

#### MailHog Integration

```typescript
// Wait for verification email
const received = await AuthHelper.waitForEmailInMailHog(
  'user@example.com',
  'WMF account verification',
  10000
)

// Extract verification token
const token =
  await AuthHelper.getVerificationTokenFromMailHog('user@example.com')

// Clear all emails
await AuthHelper.clearMailHog()
```

#### Worker-Scoped Fixtures

```typescript
import { test } from '../../playwright/fixtures'

// Each worker gets unique authenticated state
test('authenticated test', async ({ page, testAccount }) => {
  console.log('Using account:', testAccount.email)
  // Already authenticated, can access protected routes
})
```

### Test Data

#### Pre-defined Test Users (TEST_USERS)

```
| Constant        | Email                    | Account Type    | Active After Verification |
| :-------------- | :----------------------- | :-------------- | :------------------------ |
| REGULAR_USER    | test.user@wmf.test       | Regular         | Yes                       |
| PRIVATE_TEACHER | private.teacher@wmf.test | Private Teacher | No (needs approval)       |
| SCHOOL_TEACHER  | school.teacher@wmf.test  | School Teacher  | Yes                       |
| BOTH_TEACHERS   | both.teacher@wmf.test    | Both Teachers   |	No (needs approval)      |
| ADMIN           |	admin@wmf.test           | Admin           | Yes                       |
```

- All test users use passwords matching pattern: [Type][Number]!@# (e.g., Test123!@#)

### Key Testing Considerations

#### Service Dependencies

- Tests require these services running:

```bash
# Backend (Terminal 1)
cd ../wmf-nest && pnpm dev  # localhost:3000

# Frontend (Terminal 2)
pnpm dev  # localhost:3001

# MailHog (Terminal 3)
mailhog  # localhost:8025 (web UI), localhost:1025 (SMTP)
```

- GraphQL endpoints must be available for authentication flows
- **Network error simulation** via route blocking for resilience testing

#### Form Validation Testing

- **VeeValidate** field validation triggered by blur events or form submission
- **Async validation timing** requires appropriate waits
- **Multi-field validation** (e.g., password validation needs email context)

#### Authentication Testing

- **httpOnly cookie authentication** matches production flow
- **Route protection** via auth middleware tested
- **Role-based access** validated through store integration
- **Email verification** tested via MailHog integration

### Test Execution

```bash
# Run all E2E tests
pnpm test:e2e

# Run with browser UI for debugging
pnpm test:e2e:headed

# Debug specific test with breakpoints
pnpm test:e2e:debug

# Run specific test file
npx playwright test tests/e2e/authentication.example.spec.ts

# Run tests in specific browser
npx playwright test --project=chromium
```

#### Test Coverage

- Comprehensive test plan `authentication-test-plan.md` covers:
  ✅ Registration - All user types with validation
  ✅ Email Verification - Valid, expired, invalid tokens
  ✅ Sign In - Happy paths and error cases
  ✅ Form Validation - Email format, password requirements
  ✅ Password Reset - Request and reset flows
  ✅ Route Protection - Middleware-based access control
  ✅ MailHog Integration - Email testing without production emails
  ✅ GraphQL API - Direct backend testing
  ✅ Security - SQL injection, XSS, CSRF scenarios
  ✅ Accessibility - WCAG compliance testing

#### Testing Resources

- **Test Plan**: `authentication-test-plan.md` - 50+ test scenarios
- **Testing Guide**: `TESTING_GUIDE.md` - Usage examples, patterns, troubleshooting
- **Implementation Summary**: `authentication-implementation-summary.md`
- **Example Tests**: `authentication.example.spec.ts`
- **Page Objects**: `pageObjects` - Reusable page components
- **Helpers**: `helpers` - Authentication and MailHog utilities
- **Fixtures**: `fixtures.ts` - Worker-scoped authentication

## Security Notes

- **No client-side JWT storage** - tokens stay in httpOnly cookies
- **Server-side validation** on every protected route
- **Role-based permissions** enforced both client and server-side
- **CORS** configured for development/production environments
