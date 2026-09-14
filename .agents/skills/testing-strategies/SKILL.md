---
name: testing-strategies
description: "Provides a comprehensive understanding of different testing types (unit, component, store/integration, E2E), why each is required, and when to use them. Includes the testing pyramid, do's and don'ts with examples, and links to implementation skills. Use when choosing a test type, planning test coverage, understanding testing strategy, or deciding how to test a feature."
---

# Testing Strategies

A guide to understanding testing types, why they exist, and how to apply them effectively in the Nuxt 4 + Rails monorepo. This skill answers the **what** and **why** — for the **how**, follow the linked implementation skills.

## References

- [Vitest Guide](https://vitest.dev/guide/)
- [Playwright Introduction](https://playwright.dev/docs/intro)
- [Software Testing Strategies (TestCollab)](https://testcollab.com/blog/software-testing-strategies)
- [Pinia Colada Testing Cookbook](https://pinia-colada.esm.dev/cookbook/testing.html)
- [@nuxt/test-utils](https://nuxt.com/docs/getting-started/testing)

## The Testing Pyramid

The testing pyramid is the foundation of an effective testing strategy. It distributes tests by cost, speed, and scope:

```
        ╱ E2E Tests ╲              ← Few, slow, high confidence
       ╱──────────────╲               per test, but expensive
      ╱ Component Tests╲           ← Selective, test rendered
     ╱──────────────────╲            UI behavior in isolation
    ╱  Store/Integration  ╲        ← Moderate count, test data
   ╱────────────────────────╲        pipelines with real internals
  ╱      Unit Tests          ╲     ← Many, fast, isolated,
 ╱────────────────────────────╲      test pure logic
```

### Why a Pyramid Shape?

- **Cost increases upward.** E2E tests require a running browser and server. Unit tests run in milliseconds with no infrastructure.
- **Failure specificity decreases upward.** A failing unit test tells you exactly which function broke. A failing E2E test tells you "something is wrong" — often requiring investigation.
- **Bugs caught earlier are cheaper.** Research consistently shows defects found during coding cost 10–100× less to fix than those found in production.

The goal is **not** to maximize test count — it's to catch the right bugs at the cheapest layer possible.

---

## Test Types

### 1. Unit Tests

**What they test:** Pure functions, utilities, composables, and isolated logic with no external dependencies.

**Why they're required:**
- Fastest feedback loop — run in milliseconds
- Pinpoint exactly where logic breaks
- Enable confident refactoring of internal implementations
- Force clean function design with clear inputs and outputs

**Tool:** Vitest
**Skill:** `vitest-testing` — patterns for pure functions, composables, mocking, and assertions
**Location:** `tests/unit/`

#### Do's

- Test **input/output contracts** — given these inputs, expect this output
- Test **edge cases**: null, undefined, empty strings, empty arrays, zero, negative numbers, boundary values
- Test **error paths**: what happens when the function receives invalid input
- Keep each test focused on a single behavior
- Use descriptive test names that explain the scenario

```typescript
// GOOD — tests a specific behavior and edge case
describe('formatPhone', () => {
  it('formats a 10-digit number as (XXX) XXX-XXXX', () => {
    expect(formatPhone('1234567890')).toBe('(123) 456-7890')
  })

  it('returns empty string for null input', () => {
    expect(formatPhone(null)).toBe('')
  })

  it('returns original string when fewer than 10 digits', () => {
    expect(formatPhone('12345')).toBe('12345')
  })
})
```

#### Don'ts

- Don't test framework behavior (e.g., "Vue reactivity works", "ref updates")
- Don't test trivial getters/setters that have no logic
- Don't mock everything — if you're mocking more than you're testing, reconsider the test type
- Don't test private/internal functions — test through the public API

```typescript
// BAD — tests Vue reactivity, not your code
it('ref is reactive', () => {
  const count = ref(0)
  count.value = 1
  expect(count.value).toBe(1)  // This tests Vue, not your app
})

// BAD — tests a trivial getter with no logic
it('returns the name', () => {
  const user = { name: 'Alice' }
  expect(user.name).toBe('Alice')  // What could go wrong here?
})
```

---

### 2. Store/Integration Tests

**What they test:** Pinia stores with Pinia Colada queries (`defineQuery`) and mutations (`defineMutation`), exercising the real data fetching pipeline with API calls mocked at the network layer via MSW.

**Why they're required:**
- Verify that data flows correctly from API → query → store → component
- Test dependent query activation (query B fires only when store value A is set)
- Verify cache invalidation after mutations
- Catch errors in request URL construction, response parsing, and error handling
- Exercise real Pinia + Pinia Colada internals — not stubs

**Tool:** Vitest + MSW + Pinia Colada
**Skills:** `store-testing` (patterns), `msw-api-mocking` (handler setup)
**Location:** `tests/stores/`

#### Do's

- Mock at the **network layer** with MSW — let real Pinia Colada internals execute
- Use `setupPiniaWithColada()` + `runInContext()` for query/mutation composables
- Use `flushPromises()` after any action that triggers async queries
- Test the full query lifecycle: loading → success, loading → error
- Test dependent queries by setting the prerequisite store value and verifying activation
- Create **mock factories** with sensible defaults for each API domain
- Use `server.use()` per-test overrides for specific scenarios (errors, empty responses)

```typescript
// GOOD — tests real Pinia Colada pipeline with MSW
it('fetches locations list', async () => {
  const queries = runInContext(() => useLocationQueries())
  await flushPromises()

  expect(queries.locations.value.status).toBe('success')
  expect(queries.locations.value.data).toHaveLength(2)
})

// GOOD — tests dependent query activation
it('fetches location details when locationId is set', async () => {
  const store = useLocationsStore()
  const queries = runInContext(() => useLocationQueries())

  store.locationId = 42
  await flushPromises()

  expect(queries.location.value.status).toBe('success')
  expect(queries.location.value.data!.id).toBe(42)
})
```

#### Don'ts

- **Never** use `createTestingPinia()` — it stubs actions and breaks Pinia Colada internals
- Don't mock `$fetch` with `vi.mock` — use MSW network-level interception
- Don't test Pinia internals (reactivity, subscription mechanics)
- Don't skip error state tests — API errors are common in production

```typescript
// BAD — createTestingPinia breaks Pinia Colada
import { createTestingPinia } from '@pinia/testing'
setActivePinia(createTestingPinia())  // NEVER DO THIS

// BAD — vi.mock bypasses the real fetch pipeline
vi.mock('$fetch', () => vi.fn())  // Use MSW instead
```

---

### 3. Component Tests

**What they test:** Vue components mounted with the Nuxt runtime context, verifying rendered output, prop/emit contracts, conditional rendering, and user interaction within a single component.

**Why they're required:**
- Verify that components render the correct content based on props and state
- Test that user interactions trigger the right emits and state changes
- Catch rendering bugs (wrong conditional, missing data display) before they become E2E failures
- Faster and more reliable than E2E for testing individual component behavior

**Tool:** Vitest + `@nuxt/test-utils` (`mountSuspended`)
**Skill:** `vitest-testing` — component mounting, event testing, slot testing
**Location:** `tests/components/`

#### Do's

- Use `mountSuspended` from `@nuxt/test-utils/runtime` for Nuxt-aware mounting
- Test **observable behavior**: rendered text, visible elements, emitted events
- Test prop variations: required props, optional props, edge-case prop values
- Test user interactions: clicks, input changes, form submissions
- Test conditional rendering: elements shown/hidden based on state

```typescript
// GOOD — tests observable behavior
it('displays the account email', async () => {
  const component = await mountSuspended(AccountCard, {
    props: { account: { id: 1, email: 'test@example.com' } },
  })
  expect(component.text()).toContain('test@example.com')
})

// GOOD — tests user interaction and emitted event
it('emits select event when clicked', async () => {
  const component = await mountSuspended(AccountCard, {
    props: { account: { id: 1, email: 'test@example.com' } },
  })
  await component.find('[data-testid="select-btn"]').trigger('click')
  expect(component.emitted('select')).toHaveLength(1)
})
```

#### Don'ts

- Don't test component internal state — test what the user sees
- Don't test styles or CSS classes unless they indicate functional state
- Don't create component tests for things a unit test can cover (e.g., computed property logic)
- Don't write full-page component tests that amount to a slow E2E test

```typescript
// BAD — tests internal state rather than observable behavior
it('sets isLoading to true', async () => {
  const component = await mountSuspended(MyComponent)
  expect(component.vm.isLoading).toBe(true)  // Internal state

  // BETTER: test what the user sees
  expect(component.text()).toContain('Loading...')
})
```

---

### 4. E2E Tests (End-to-End)

**What they test:** Complete user journeys in a real browser against the running application, crossing page boundaries and integrating all layers (frontend, backend API, database).

**Why they're required:**
- Verify that the full stack works together — routing, authentication, API integration, UI rendering
- Catch integration bugs that no lower-level test can detect (misconfigured proxy, broken navigation, auth cookie handling)
- Validate critical business flows that generate revenue or manage safety (checkout, registration, payments)
- Test cross-browser behavior

**Tool:** Playwright
**Skill:** `playwright-best-practices` — locators, assertions, POM, debugging, CI/CD, and advanced patterns
**Location:** `tests/e2e/`

#### Do's

- Reserve E2E for **critical user journeys** that cross page boundaries
- Use resilient locators: `getByRole`, `getByLabel`, `getByText` — not CSS selectors
- Use web-first assertions: `await expect(locator).toBeVisible()`
- Implement Page Object Model for pages tested by multiple specs
- Test the happy path AND the primary error path for each journey
- Use test isolation — each test should be independent

```typescript
// GOOD — tests a complete user journey with resilient locators
test('admin can create an event', async ({ page }) => {
  await page.goto('/events/new')
  await page.getByLabel('Event Name').fill('Summer Concert')
  await page.getByLabel('Date').fill('2025-07-15')
  await page.getByRole('button', { name: 'Create Event' }).click()

  await expect(page.getByText('Event created successfully')).toBeVisible()
  await expect(page).toHaveURL(/\/events\/\d+/)
})
```

#### Don'ts

- Don't use E2E to test something a unit or component test can cover
- Don't use CSS selectors when role/label locators are available
- Don't use hard-coded waits (`page.waitForTimeout(2000)`) — use assertions
- Don't test every CRUD permutation — test the critical path; unit/store tests cover variants
- Don't skip cleanup or isolation — flaky tests erode trust in the suite

```typescript
// BAD — hard-coded wait and CSS selector
await page.waitForTimeout(3000)
await page.click('.btn-primary')  // Brittle selector

// GOOD — web-first assertion with accessible locator
await expect(page.getByRole('button', { name: 'Submit' })).toBeEnabled()
await page.getByRole('button', { name: 'Submit' }).click()
```

---

## Choosing the Right Test Type

Use this decision tree when deciding how to test a piece of code:

```
What are you testing?
│
├─ Pure function or utility?
│  └─ UNIT TEST
│
├─ Composable with no external dependencies?
│  └─ UNIT TEST
│
├─ Pinia store local state / $reset / factory?
│  └─ UNIT TEST (store)
│
├─ Pinia Colada query or mutation?
│  └─ STORE/INTEGRATION TEST (MSW)
│
├─ Component rendering from props?
│  └─ COMPONENT TEST
│
├─ Component user interaction (click, input)?
│  └─ COMPONENT TEST
│
├─ Multi-page user workflow?
│  └─ E2E TEST
│
├─ Authentication / authorization flow?
│  └─ E2E TEST
│
├─ Full-stack integration (frontend + API + DB)?
│  └─ E2E TEST
│
└─ Not sure?
   └─ Start at the LOWEST level that can cover it.
      Can a unit test cover it? → Use unit test.
      Needs component mounting? → Component test.
      Needs real API pipeline? → Store/integration test.
      Needs a browser? → E2E test.
```

## Testing Strategy Principles

### 1. Shift Left

Move testing earlier in development. Write tests alongside or before the feature code, not after. A bug caught during development costs almost nothing to fix. The same bug found in production can mean hotfixes, rollbacks, and support tickets.

### 2. Test Behavior, Not Implementation

Tests should assert **what** the code does, not **how** it does it. This makes tests resilient to refactoring. If you rename an internal variable, your tests should still pass. If you change a visible behavior, your tests should catch it.

### 3. Risk-Based Prioritization

Not all code needs the same testing intensity:
- **High risk:** Payment flows, authentication, data mutations → thorough tests at multiple levels
- **Medium risk:** List/detail pages, CRUD operations → store + component tests
- **Low risk:** Static content, about pages → minimal or no tests

### 4. Maintain the Suite

Dead tests, flaky tests, and duplicate tests erode confidence. A failing test that everyone ignores is worse than no test. Prune regularly, fix flaky tests immediately, and delete tests that no longer serve a purpose.

### 5. Automate the Right Things

Automate stable, repetitive, high-value tests. Manual or exploratory testing still has a place for:
- New features where edge cases aren't yet understood
- Usability testing requiring human judgment
- One-off bug investigations

---

## Skill Cross-References

| What you need | Skill to read |
|---------------|---------------|
| Writing Vitest unit/component tests | `vitest-testing` |
| Testing Pinia stores with Pinia Colada | `store-testing` |
| Setting up MSW request handlers | `msw-api-mocking` |
| Writing/debugging Playwright E2E tests | `playwright-best-practices` |
| Testing form validation (Zod) | `zod-form-validation` |
| Pinia Colada store architecture | `pinia-colada-data-fetching` |
| General test patterns and examples | `testing-patterns` |

---

## Anti-Patterns to Avoid

| Anti-Pattern | Why It's Wrong | What To Do Instead |
|---|---|---|
| Testing everything with E2E | Slow, expensive, flaky, hard to debug | Push tests down the pyramid |
| No integration tests for API calls | Misses broken URLs, bad parsing, missing error handling | Use store tests with MSW |
| Mocking everything in unit tests | You're testing your mocks, not your code | Only mock external boundaries |
| `createTestingPinia()` with Pinia Colada | Breaks Colada's internal stores | Use `createPinia()` + `PiniaColada` plugin |
| Hard-coded waits in E2E | Flaky, slow, masks timing bugs | Use web-first assertions |
| CSS selectors in E2E | Brittle, break on styling changes | Use role/label/text locators |
| Testing implementation details | Breaks on refactoring, doesn't catch real bugs | Test observable behavior |
| No error path tests | Happy-path-only tests miss production failures | Always test error states |
| Duplicate tests across levels | Wasteful, increases maintenance | Test at the lowest appropriate level |
