---
name: vitest-testing
description: "Provides unit testing and component testing patterns using Vitest with @nuxt/test-utils. Use when writing unit tests, component tests, store tests, mocking modules, mocking API calls, or configuring Vitest in the monorepo."
---

# Vitest Testing

## References

- [Vitest Guide](https://vitest.dev/guide/)
- [Vitest API](https://vitest.dev/api/)
- [Vitest Expect API](https://vitest.dev/api/expect)
- [Vitest Mocking Guide](https://vitest.dev/guide/mocking)
- [Vitest Snapshot Guide](https://vitest.dev/guide/snapshot)
- [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing)

## Project Configuration

### Root Vitest Config (`vitest.config.ts`)

```typescript
import { defineVitestProject } from '@nuxt/test-utils/config'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', '**/*.config.*', 'app/graphql/gql/**', '**/*.d.ts'],
    },
    projects: [
      {
        test: {
          name: 'unit',
          include: ['./tests/unit/**/*.test.ts'],
          setupFiles: ['./tests/setup-unit.ts'],
          environment: 'node',
        },
      },
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: ['./tests/nuxt/**/*.test.ts'],
          setupFiles: ['./tests/setup.ts'],
          environment: 'nuxt',
        },
      }),
    ],
  },
})
```

### Key Points

- The `unit` project runs `tests/unit/**/*.test.ts` in Node and loads `tests/setup-unit.ts`.
- The `nuxt` project runs `tests/nuxt/**/*.test.ts` with Nuxt test utilities and loads `tests/setup.ts`.
- Explicit imports from `vitest` are required; the config does not enable globals.
- `tests/setup.ts` provides common mocks for Apollo, VeeValidate, Stripe, Nuxt composables, browser APIs, and Testing Library matchers.
- Playwright E2E tests run separately through `pnpm test:e2e`.

### Running Tests

```bash
# Run all Vitest projects once
pnpm test

# Watch a project with the Vitest UI
pnpm test:unit
pnpm test:nuxt

# Run a specific project once
dotenvx run --env-file=.env.test -- vitest run --project=unit
dotenvx run --env-file=.env.test -- vitest run --project=nuxt

# Collect coverage
pnpm test:coverage
```

## Test File Structure

### Directory Layout

```
tests/
├── setup-unit.ts              # Unit-project globals and browser API stubs
├── setup.ts                   # Nuxt-project mocks and Testing Library matchers
├── unit/                      # Pure utility and store tests
│   ├── utils/
│   └── stores/
├── nuxt/                      # Nuxt runtime and component tests
│   ├── components/
│   └── pages/
└── e2e/                       # Playwright tests, outside Vitest
```

### Naming Convention

- Test files: `<name>.test.ts` (preferred) or `<name>.spec.ts`
- Place tests in the subdirectory matching the source category (`utils/`, `composables/`, etc.)

## Unit Testing Patterns

### Testing Pure Functions

```typescript
import { describe, expect, it } from 'vitest'
import { formatPhone } from '~/utils/phoneNumbers'

describe('formatPhone', () => {
  it('returns an empty string for null', () => {
    expect(formatPhone(null)).toBe('')
  })

  it('formats a plain 10-digit number', () => {
    expect(formatPhone('1234567890')).toBe('(123) 456-7890')
  })

  it('returns the original string when there are too few digits', () => {
    expect(formatPhone('12345')).toBe('12345')
  })
})
```

### Testing Composables

```typescript
import { describe, expect, it } from 'vitest'
import { useDateHandling } from '~/composables/useDateHandling'

describe('useDateHandling', () => {
  const { pgDateToString, stringToLocalDate } = useDateHandling()

  describe('pgDateToString', () => {
    it('converts a Date object to a YYYY-MM-DD string', () => {
      const date = new Date(2023, 0, 15)
      expect(pgDateToString(date)).toBe('2023-01-15')
    })

    it('handles ISO datetime strings', () => {
      expect(pgDateToString('2023-05-15T12:00:00Z')).toBe('2023-05-15')
    })
  })

  describe('stringToLocalDate', () => {
    it('returns a Date object', () => {
      expect(stringToLocalDate('2023-01-15')).toBeInstanceOf(Date)
    })

    it('round-trips correctly through pgDateToString', () => {
      const original = '2023-09-14'
      expect(pgDateToString(stringToLocalDate(original))).toBe(original)
    })
  })
})
```

### Testing Object Utilities

```typescript
import { describe, expect, it } from 'vitest'
import { stripTimestamps } from '~/utils/objectFunctions'

describe('stripTimestamps', () => {
  it('removes created_at and updated_at', () => {
    const input = { id: 1, name: 'Alice', created_at: '2024-01-01', updated_at: '2024-06-01' }
    const result = stripTimestamps(input)
    expect(result).toEqual({ id: 1, name: 'Alice' })
    expect(result).not.toHaveProperty('created_at')
  })

  it('does not mutate the original object', () => {
    const input = { id: 4, name: 'Dave', created_at: '2024-01-01', updated_at: '2024-01-02' }
    stripTimestamps(input)
    expect(input).toHaveProperty('created_at')
  })
})
```

## Component Testing Patterns

### Mounting Components with `@nuxt/test-utils`

Use Testing Library's `render` for the project's component tests. For components that issue GraphQL operations, provide an Apollo client created with `mock-apollo-client`.

```typescript
import { describe, expect, it } from 'vitest'
import { render } from '@testing-library/vue'
import MyComponent from '~/components/MyComponent.vue'

describe('MyComponent', () => {
  it('renders correctly', async () => {
    const { getByText } = render(MyComponent)
    expect(getByText('Expected Text')).toBeInTheDocument()
  })

  it('renders with props', async () => {
    const { getByText } = render(MyComponent, {
      props: { title: 'Hello', count: 5 },
    })
    expect(getByText('Hello')).toBeInTheDocument()
  })
})
```

### Testing Component Events

```typescript
describe('ButtonComponent', () => {
  it('emits click event', async () => {
    const component = render(ButtonComponent, {
      props: { label: 'Click me' },
    })

    await component.getByRole('button').click()
    expect(component.emitted('click')).toHaveLength(1)
  })
})
```

### Testing Computed / Reactive State in Components

```typescript
describe('CounterComponent', () => {
  it('increments the count on button click', async () => {
    const component = render(CounterComponent)

    expect(component.getByText('Count: 0')).toBeInTheDocument()
    await component.getByTestId('increment').click()
    expect(component.getByText('Count: 1')).toBeInTheDocument()
  })
})
```

For a GraphQL component, create a mock client, register document handlers with `setRequestHandler`, and provide it under `DefaultApolloClient`. See `app/pages/login.nuxt.test.ts` for the local pattern.

## Pinia Store Testing

### Basic Store Test

```typescript
import { describe, expect, it, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAccountsStore } from '~/stores/accountsStore'

describe('AccountsStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('has correct initial state', () => {
    const store = useAccountsStore()
    expect(store.selectedAccount).toBeNull()
  })

  it('selects an account', () => {
    const store = useAccountsStore()
    const mockAccount = { id: 1, email: 'test@example.com' }
    store.selectAccount(mockAccount)
    expect(store.selectedAccount).toEqual(mockAccount)
  })
})
```

### Testing Computed Properties in Stores

```typescript
describe('OrderCollectionStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('computes cartItemCount from orders', () => {
    const store = useOrderCollectionStore()
    store.newOrderCollection.orders = [
      { id: 1, amount: 10 },
      { id: 2, amount: 20 },
    ]
    expect(store.cartItemCount).toBe(2)
  })

  it('computes totalOrderCost', () => {
    const store = useOrderCollectionStore()
    store.newOrderCollection.orders = [
      { id: 1, amount: 10 },
      { id: 2, amount: 20 },
    ]
    expect(store.totalOrderCost).toBe(30)
  })
})
```

For Pinia stores, create a fresh Pinia instance in `beforeEach` with `setActivePinia(createPinia())`. Keep store tests in `tests/unit/` so they run in the Node project.

## Mocking

### Mocking Modules with `vi.mock`

`vi.mock` is hoisted to the top of the file. Use it to mock entire modules:

```typescript
import { describe, expect, it, vi } from 'vitest'
import { useMyComposable } from '~/composables/useMyComposable'

// Mock an entire module
vi.mock('~/composables/useApi', () => ({
  useApi: () => ({
    data: ref({ items: [] }),
    pending: ref(false),
    error: ref(null),
  }),
}))

describe('useMyComposable', () => {
  it('returns default state', () => {
    const result = useMyComposable()
    expect(result.items.value).toEqual([])
  })
})
```

### Mocking Part of a Module

```typescript
vi.mock('~/utils/helpers', async (importOriginal) => {
  const mod = await importOriginal<typeof import('~/utils/helpers')>()
  return {
    ...mod,
    fetchData: vi.fn(() => Promise.resolve({ id: 1 })),
  }
})
```

### Mocking `$fetch` / API Calls

Mock `$fetch` directly in a focused unit test. For GraphQL component tests, use `mock-apollo-client` rather than issuing network requests:

```typescript
import { describe, expect, it, vi } from 'vitest'

vi.stubGlobal('$fetch', vi.fn())

describe('API integration', () => {
  it('fetches data from the API', async () => {
    const mockData = { id: 1, name: 'Test' }
    vi.mocked($fetch).mockResolvedValueOnce(mockData)

    const result = await $fetch('/api/items/1')
    expect(result).toEqual(mockData)
    expect($fetch).toHaveBeenCalledWith('/api/items/1')
  })
})
```

### Spies with `vi.spyOn`

```typescript
import { describe, expect, it, vi } from 'vitest'
import * as helpers from '~/utils/helpers'

describe('spy example', () => {
  it('tracks calls to a function', () => {
    const spy = vi.spyOn(helpers, 'formatDate')
    helpers.formatDate('2023-01-01')
    expect(spy).toHaveBeenCalledWith('2023-01-01')
    spy.mockRestore()
  })
})
```

### Mock Functions

```typescript
const mockFn = vi.fn()
mockFn('hello')

expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('hello')
expect(mockFn).toHaveBeenCalledTimes(1)

// With return values
const mockCalculate = vi.fn().mockReturnValue(42)
expect(mockCalculate()).toBe(42)

// With async
const mockFetch = vi.fn().mockResolvedValue({ data: 'test' })
await expect(mockFetch()).resolves.toEqual({ data: 'test' })
```

### Mocking Timers

```typescript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

describe('timer-dependent code', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('executes after timeout', () => {
    const callback = vi.fn()
    setTimeout(callback, 1000)

    vi.advanceTimersByTime(1000)
    expect(callback).toHaveBeenCalledOnce()
  })

  it('mocks the current date', () => {
    vi.setSystemTime(new Date(2023, 0, 1))
    expect(new Date().getFullYear()).toBe(2023)
  })
})
```

## Assertion Reference (Most-Used)

### Equality & Identity
| Matcher | Purpose |
|---------|---------|
| `toBe(value)` | Strict equality (`===`) / same reference |
| `toEqual(value)` | Deep equality (structure match) |
| `toStrictEqual(value)` | Deep equality + checks prototypes and `undefined` properties |
| `toMatchObject(obj)` | Object contains subset of properties |

### Truthiness
| Matcher | Purpose |
|---------|---------|
| `toBeTruthy()` | Truthy when coerced to boolean |
| `toBeFalsy()` | Falsy when coerced to boolean |
| `toBeNull()` | Strictly `null` |
| `toBeUndefined()` | Strictly `undefined` |
| `toBeDefined()` | Not `undefined` |
| `toBeNaN()` | Is `NaN` |

### Numbers
| Matcher | Purpose |
|---------|---------|
| `toBeGreaterThan(n)` | `>` |
| `toBeGreaterThanOrEqual(n)` | `>=` |
| `toBeLessThan(n)` | `<` |
| `toBeLessThanOrEqual(n)` | `<=` |
| `toBeCloseTo(n, digits?)` | Float comparison |

### Strings & Arrays
| Matcher | Purpose |
|---------|---------|
| `toContain(item)` | Array includes item / string includes substring |
| `toContainEqual(item)` | Array includes item with deep equality |
| `toHaveLength(n)` | `.length === n` |
| `toMatch(regex\|string)` | String matches regex or substring |

### Objects
| Matcher | Purpose |
|---------|---------|
| `toHaveProperty(key, value?)` | Object has property (deep path with dots) |
| `toBeInstanceOf(Class)` | `instanceof` check |

### Exceptions
| Matcher | Purpose |
|---------|---------|
| `toThrow()` | Function throws |
| `toThrowError(msg\|regex)` | Function throws with message |

### Mock/Spy Assertions
| Matcher | Purpose |
|---------|---------|
| `toHaveBeenCalled()` | Function was called |
| `toHaveBeenCalledTimes(n)` | Called exactly n times |
| `toHaveBeenCalledWith(...args)` | Called with specific args |
| `toHaveBeenLastCalledWith(...args)` | Last call had specific args |
| `toHaveReturned()` | Function returned (did not throw) |
| `toHaveReturnedWith(value)` | Function returned specific value |

### Async Assertions

```typescript
// Resolves
await expect(asyncFn()).resolves.toBe('value')

// Rejects
await expect(asyncFn()).rejects.toThrowError('error message')
```

### Negation

Prefix any matcher with `.not`:
```typescript
expect(value).not.toBe(other)
expect(array).not.toContain(item)
```

### Soft Assertions

`expect.soft` continues the test even if the assertion fails (reports all failures at the end):
```typescript
expect.soft(1 + 1).toBe(3) // marks test as failed but continues
expect.soft(1 + 2).toBe(4) // also checked and reported
```

## Snapshots

### Inline Snapshots

```typescript
it('matches inline snapshot', () => {
  const data = { foo: 'bar', count: 42 }
  expect(data).toMatchInlineSnapshot()
  // Vitest auto-fills the snapshot string on first run
})
```

### File Snapshots

```typescript
it('matches snapshot', () => {
  const result = processData(input)
  expect(result).toMatchSnapshot()
  // Stored in __snapshots__/<file>.snap
})
```

Update snapshots: `pnpm vitest run -u`

## Setup & Teardown

```typescript
import { afterAll, afterEach, beforeAll, beforeEach, describe, it } from 'vitest'

describe('lifecycle hooks', () => {
  beforeAll(() => {
    // Runs once before all tests in this describe block
  })

  afterAll(() => {
    // Runs once after all tests in this describe block
  })

  beforeEach(() => {
    // Runs before each test
  })

  afterEach(() => {
    // Runs after each test
  })

  it('test case', () => {
    // ...
  })
})
```

### Cleanup in beforeEach

`beforeEach` can return a cleanup function (equivalent to `afterEach`):

```typescript
beforeEach(() => {
  const server = startMockServer()
  return () => server.close()
})
```

## Test Modifiers

```typescript
test.skip('skipped test', () => { /* not run */ })
test.only('focused test', () => { /* only this runs */ })
test.todo('implement later')

// Conditional
test.skipIf(process.env.CI)('local only', () => { /* ... */ })
test.runIf(process.env.CI)('CI only', () => { /* ... */ })
```

## Parameterized Tests

### Using `test.each`

```typescript
test.each([
  { input: '1234567890', expected: '(123) 456-7890' },
  { input: '123-456-7890', expected: '(123) 456-7890' },
  { input: '4567890', expected: '(204) 456-7890' },
])('formatPhone($input) → $expected', ({ input, expected }) => {
  expect(formatPhone(input)).toBe(expected)
})
```

### Using `test.for`

`test.for` doesn't spread array arguments (cleaner for array cases):

```typescript
test.for([
  [1, 1, 2],
  [1, 2, 3],
  [2, 1, 3],
])('add(%i, %i) → %i', ([a, b, expected]) => {
  expect(a + b).toBe(expected)
})
```

## Best Practices

1. **Prefer explicit imports** — Even with `globals: true`, import `describe`, `it`, `expect`, `vi` from `'vitest'` for clarity and IDE support.
2. **One assertion per test** (when practical) — Makes failures easy to diagnose.
3. **Use descriptive test names** — `it('returns empty string for null input')` not `it('test 1')`.
4. **Group with `describe` blocks** — Organize by function or behavior being tested.
5. **Always clean up mocks** — Use `vi.restoreAllMocks()` in `afterEach` or set `restoreMocks: true` in config.
6. **Don't test implementation details** — Test behavior and outputs, not internal state.
7. **Use Testing Library's `render`** for Nuxt component tests and provide `DefaultApolloClient` when the component uses GraphQL.
8. **Use `toEqual` for objects, `toBe` for primitives** — `toBe` checks reference identity, `toEqual` checks structure.
9. **Don't mutate shared state** — Create fresh data in `beforeEach` or inside each test.
10. **Keep tests fast** — Mock external dependencies ($fetch, APIs, timers).
