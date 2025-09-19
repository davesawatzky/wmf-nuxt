# Testing Strategy for WMF Nuxt

## Overview

This project uses a comprehensive testing approach with multiple testing layers:

- **Unit Tests** (Vitest): Testing individual functions, utilities, and store logic
- **Component Tests** (Vitest + Vue Test Utils): Testing Vue components in isolation
- **End-to-End Tests** (Playwright): Testing complete user workflows and integration

## Testing Stack

### Vitest (Unit & Component Testing)

- **Environment**: happy-dom for DOM simulation
- **Coverage**: c8 with HTML and text reports
- **Mocking**: Built-in vi.mock() for dependencies
- **Framework Integration**: Nuxt auto-imports and composables

### Playwright (E2E Testing)

- **Browsers**: Chromium, Firefox, WebKit, Mobile Chrome
- **Features**: Screenshots, traces, video recording on failure
- **Server**: Auto-starts dev server for testing
- **Parallel**: Full parallel execution with retry logic

## Test Organization

```
tests/
├── setup.ts                 # Global test configuration
├── components/              # Component tests
│   ├── BaseInput.test.ts
│   └── FormComponents.test.ts
├── stores/                  # Store unit tests
│   ├── useAuthStore.test.ts
│   └── useRegistration.test.ts
├── utils/                   # Utility function tests
│   └── functions.test.ts
└── e2e/                     # End-to-end tests
    ├── auth.spec.ts
    ├── registration-form.spec.ts
    └── general.spec.ts
```

## Testing Commands

```bash
# Unit Tests
pnpm test:unit              # Run all unit tests
pnpm test:unit:watch        # Watch mode for development

# Component Tests
pnpm test:component         # Test Vue components
pnpm test:component:watch   # Watch mode

# Store Tests
pnpm test:store             # Test Pinia stores
pnpm test:store:watch       # Watch mode

# End-to-End Tests
pnpm test:e2e               # Run Playwright tests
pnpm test:e2e:headed        # Run with browser UI
pnpm test:e2e:debug         # Debug mode

# Coverage
pnpm test:coverage          # Generate coverage report

# All Tests
pnpm test                   # Run all test suites
```

## Testing Patterns

### Store Testing

```typescript
import { createPinia, setActivePinia } from 'pinia'
import { useAuthStore } from '~/stores/useAuthStore'

describe('useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with correct default state', () => {
    const store = useAuthStore()
    expect(store.isAuthenticated).toBe(false)
    expect(store.user).toBeNull()
  })
})
```

### Component Testing

```typescript
import { mount } from '@vue/test-utils'
import BaseInput from '~/components/base/BaseInput.vue'

describe('BaseInput', () => {
  it('should render with label', () => {
    const wrapper = mount(BaseInput, {
      props: { label: 'Test Label', name: 'test' },
    })
    expect(wrapper.text()).toContain('Test Label')
  })
})
```

### E2E Testing

```typescript
import { test, expect } from '@playwright/test'

test('should complete registration flow', async ({ page }) => {
  await page.goto('/form')
  await page.getByText('Solo Performer').click()
  // ... test user journey
})
```

## Mocking Strategies

### GraphQL Mocking

```typescript
// Mock Apollo Client
vi.mock('#apollo/clients/default', () => ({
  default: {
    query: vi.fn(),
    mutate: vi.fn(),
  },
}))
```

### Nuxt Composables

```typescript
// Mock Nuxt navigation
vi.mock('#app', () => ({
  navigateTo: vi.fn(),
  useRouter: () => ({ push: vi.fn() }),
}))
```

### VeeValidate Forms

```typescript
// Mock form validation
vi.mock('vee-validate', () => ({
  useForm: () => ({
    handleSubmit: vi.fn((cb) => cb),
    errors: ref({}),
    isSubmitting: ref(false),
  }),
}))
```

## Test Data Management

### Fixtures

Create reusable test data in `tests/fixtures/`:

```typescript
// tests/fixtures/users.ts
export const mockUser = {
  id: '1',
  email: 'test@example.com',
  roles: ['user'],
}
```

### Factory Functions

```typescript
// tests/factories/registration.ts
export const createMockRegistration = (overrides = {}) => ({
  id: '1',
  performerType: 'solo',
  status: 'draft',
  ...overrides,
})
```

## Coverage Goals

- **Unit Tests**: >90% coverage for stores and utilities
- **Component Tests**: >80% coverage for reusable components
- **E2E Tests**: Complete critical user journeys
- **Integration**: Auth flow, form submission, payment process

## Continuous Integration

Tests run automatically on:

- Pull requests (all suites)
- Main branch pushes (full suite + coverage)
- Nightly builds (extended E2E suite)

## Best Practices

### Unit Testing

- Test business logic, not implementation details
- Mock external dependencies
- Use descriptive test names
- Group related tests with `describe` blocks

### Component Testing

- Test user interactions, not internal state
- Mock complex dependencies (Apollo, stores)
- Test accessibility attributes
- Verify prop handling and event emission

### E2E Testing

- Test complete user workflows
- Use Page Object Model for complex interactions
- Include mobile responsive testing
- Test error scenarios and edge cases

### Performance Considerations

- Run unit tests in parallel
- Use selective E2E test execution
- Optimize test data setup/teardown
- Cache dependencies in CI

## Debugging Tests

### Vitest

```bash
# Debug specific test
pnpm test:unit --reporter=verbose SomeTest

# Run single test file
pnpm test:unit stores/useAuthStore.test.ts
```

### Playwright

```bash
# Debug mode with browser
pnpm test:e2e:debug

# Run specific test
pnpm test:e2e tests/e2e/auth.spec.ts
```

## Environment Setup

### Prerequisites

- Backend server running on localhost:3000
- Test database with seed data
- Valid test user credentials

### Configuration

- Environment variables in `.env.test`
- Test-specific GraphQL endpoints
- Mock payment processing

This testing strategy ensures comprehensive coverage while maintaining fast feedback loops for development.
