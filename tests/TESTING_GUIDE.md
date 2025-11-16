# WMF Nuxt - Authentication Testing Guide

## Overview

This directory contains comprehensive authentication testing infrastructure for the Winnipeg Music Festival registration system. The testing structure includes:

- **Page Object Model** - Reusable page components for maintainable tests
- **Authentication Helpers** - Utilities for common auth operations
- **Test Fixtures** - Pre-authenticated user sessions for fast test execution
- **Test Data** - Pre-defined test users with various account types

## Quick Start

### Prerequisites

Ensure all services are running before executing tests:

```bash
# Terminal 1: Start backend (wmf-nest)
cd ../wmf-nest
pnpm dev  # Runs on http://localhost:3000

# Terminal 2: Start frontend (wmf-nuxt)
pnpm dev  # Runs on http://localhost:3001

# Terminal 3: Start MailHog (for email testing)
mailhog  # Web UI: http://localhost:8025, SMTP: localhost:1025
```

### Run Tests

```bash
# Run all authentication tests
pnpm test:e2e

# Run specific test file
npx playwright test tests/e2e/authentication.example.spec.ts

# Run with browser UI (headed mode)
pnpm test:e2e:headed

# Debug tests with Playwright Inspector
pnpm test:e2e:debug

# Run specific project (browser)
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

## Test Structure

### Page Objects (`tests/pageObjects/`)

Page objects encapsulate page-specific actions and locators, providing a clean interface for test code.

#### LoginPage

Handles sign in and registration flows:

```typescript
import { PageManager } from '../pageObjects/pageManager'

test('example', async ({ page }) => {
  const pm = new PageManager(page)

  // Navigate to login page
  await pm.loginPage.goto()

  // Sign in
  await pm.loginPage.signIn('user@example.com', 'Password123!')
  await pm.loginPage.verifySuccessfulSignIn()

  // Or register new user
  await pm.loginPage.registerRegularUser(
    'First',
    'Last',
    'email@example.com',
    'Password123!'
  )
  await pm.loginPage.verifySuccessfulRegistration()
})
```

#### EmailConfirmationPage

Handles email verification flows:

```typescript
// Navigate with token
await pm.emailConfirmationPage.gotoWithToken(token)
await pm.emailConfirmationPage.verifySuccessMessage()
await pm.emailConfirmationPage.clickContinue()
```

#### PasswordResetPage

Handles forgot password and password reset flows:

```typescript
// Request password reset
await pm.passwordResetPage.gotoForgotPassword()
await pm.passwordResetPage.requestPasswordReset('user@example.com')
await pm.passwordResetPage.verifyResetEmailSent()

// Reset password with token
await pm.passwordResetPage.resetPassword(token, 'NewPassword123!')
await pm.passwordResetPage.verifyPasswordResetSuccess()
```

#### RegistrationsPage

Main authenticated landing page:

```typescript
// Verify user is authenticated
await pm.registrationsPage.goto()
await pm.registrationsPage.verifyPageAccessible()

// Logout
await pm.registrationsPage.logout()
```

### Authentication Helpers (`tests/helpers/authHelper.ts`)

Utilities for common authentication operations without page objects.

#### Quick Sign In

```typescript
import { AuthHelper, TEST_USERS } from '../helpers/authHelper'

// Sign in with pre-defined test user
await AuthHelper.signInAsUser(page, 'REGULAR_USER')

// Or custom credentials
await AuthHelper.signIn(page, 'user@example.com', 'Password123!')

// Verify authentication state
await AuthHelper.verifyAuthenticated(page)
```

#### Quick Registration

```typescript
// Register with pre-defined test user
await AuthHelper.registerTestUser(page, 'PRIVATE_TEACHER')

// Or custom user
await AuthHelper.registerUser(page, {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  password: 'Password123!',
  privateTeacher: true,
  instrument: 'Piano',
})
```

#### MailHog Integration

```typescript
// Wait for email to arrive
const emailReceived = await AuthHelper.waitForEmailInMailHog(
  'user@example.com',
  'WMF account verification',
  20000 // timeout in ms
)

// Extract verification token
const token =
  await AuthHelper.getVerificationTokenFromMailHog('user@example.com')

// Clear all emails
await AuthHelper.clearMailHog()
```

#### GraphQL Direct API

```typescript
import { GraphQLHelper } from '../helpers/authHelper'

// Sign up via API
const result = await GraphQLHelper.signUpUser({
  email: 'test@example.com',
  password: 'Password123!',
  password2: 'Password123!',
  firstName: 'Test',
  lastName: 'User',
})

// Check user exists
const user = await GraphQLHelper.checkUserByEmail('test@example.com')
```

### Test Users (`tests/helpers/authHelper.ts`)

Pre-defined test users with various account types:

```typescript
import { TEST_USERS } from '../helpers/authHelper'

// Available test users:
TEST_USERS.REGULAR_USER // Regular user account
TEST_USERS.PRIVATE_TEACHER // Private teacher (requires approval)
TEST_USERS.SCHOOL_TEACHER // School teacher
TEST_USERS.BOTH_TEACHERS // Both teacher types
TEST_USERS.ADMIN // Admin account

// Example usage:
await pm.loginPage.signIn(
  TEST_USERS.REGULAR_USER.email,
  TEST_USERS.REGULAR_USER.password
)
```

#### Test User Details

| Account Type    | Email                    | Password      | Status After Verification   |
| --------------- | ------------------------ | ------------- | --------------------------- |
| Regular User    | test.user@wmf.test       | Test123!@#    | Active                      |
| Private Teacher | private.teacher@wmf.test | Teacher456!@# | Inactive (pending approval) |
| School Teacher  | school.teacher@wmf.test  | School789!@#  | Active                      |
| Both Teachers   | both.teacher@wmf.test    | Both000!@#    | Inactive (pending approval) |
| Admin           | admin@wmf.test           | Admin999!@#   | Active                      |

### Test Fixtures (`playwright/fixtures.ts`)

Reusable authenticated sessions for fast test execution:

```typescript
// Use pre-authenticated state
test.describe('Authenticated Tests', () => {
  test.use({ storageState: 'playwright/.auth/user_1.json' })

  test('can access protected route', async ({ page }) => {
    await page.goto('/registrations')
    // Already authenticated!
  })
})

// Or use worker-scoped authentication (parallel safe)
test.describe('Parallel Tests', () => {
  test('worker 1', async ({ testAccount }) => {
    console.log('Using account:', testAccount.email)
    // Each worker gets unique test account
  })
})
```

## Test Patterns

### Basic Authentication Test

```typescript
test('should sign in successfully', async ({ page }) => {
  const pm = new PageManager(page)

  await pm.loginPage.goto()
  await pm.loginPage.signIn('user@example.com', 'Password123!')
  await pm.loginPage.verifySuccessfulSignIn()
  await pm.registrationsPage.verifyOnRegistrationsPage()
})
```

### Registration with Email Verification

```typescript
test('should register and verify email', async ({ page }) => {
  const pm = new PageManager(page)
  const email = 'newuser@example.com'

  // Register
  await pm.loginPage.goto()
  await pm.loginPage.registerRegularUser('New', 'User', email, 'Password123!')
  await pm.loginPage.verifySuccessfulRegistration()

  // Get verification token from MailHog
  const token = await AuthHelper.getVerificationTokenFromMailHog(email)
  expect(token).not.toBeNull()

  // Verify email
  await pm.emailConfirmationPage.gotoWithToken(token!)
  await pm.emailConfirmationPage.verifySuccessMessage()

  // Sign in
  await pm.emailConfirmationPage.clickContinue()
  await pm.loginPage.signIn(email, 'Password123!')
  await pm.loginPage.verifySuccessfulSignIn()
})
```

### Form Validation Test

```typescript
test('should validate password requirements', async ({ page }) => {
  const pm = new PageManager(page)

  await pm.loginPage.goto()
  await pm.loginPage.showSignUpForm()

  // Test weak password
  await page.locator('input[name="password"]').fill('weak')
  await page.locator('input[name="password"]').blur()

  await pm.loginPage.verifyPasswordError(/at least 8 characters/i)
})
```

### Using AuthHelper for Quick Setup

```typescript
test('should access protected route when authenticated', async ({ page }) => {
  // Quick sign in
  await AuthHelper.signInAsUser(page, 'REGULAR_USER')

  // Now can access protected routes
  const pm = new PageManager(page)
  await pm.registrationsPage.goto()
  await pm.registrationsPage.verifyPageAccessible()
})
```

## Test Scenarios Coverage

See `specs/authentication-test-plan.md` for comprehensive test scenarios including:

1. **Registration** - All user types (regular, private teacher, school teacher, both, admin)
2. **Email Verification** - Valid tokens, expired tokens, invalid tokens
3. **Sign In** - Happy paths, error cases, unverified accounts
4. **Form Validation** - Empty fields, weak passwords, email format, password mismatch
5. **Existing Account Check** - Teachers with existing accounts
6. **Password Reset** - Request reset, valid/invalid tokens, new password validation
7. **Resend Emails** - Verification email, password reset email
8. **Navigation & UI** - Tab switching, route protection, logout
9. **Security** - SQL injection, XSS, CSRF, session timeout
10. **Multi-Device** - Cross-browser, mobile testing
11. **Integration** - GraphQL API, MailHog verification
12. **Performance** - Response times, concurrent users
13. **Accessibility** - Screen readers, keyboard navigation, color contrast

## Best Practices

### 1. Use Page Objects for Reusability

```typescript
// ✅ Good - using page objects
const pm = new PageManager(page)
await pm.loginPage.signIn(email, password)

// ❌ Avoid - direct locators in tests
await page.locator('input[name="email"]').fill(email)
await page.getByRole('button', { name: 'Sign In' }).click()
```

### 2. Use AuthHelper for Quick Setup

```typescript
// ✅ Good - helper for common operations
await AuthHelper.signInAsUser(page, 'REGULAR_USER')

// ❌ Avoid - repeating authentication code in every test
await page.goto('/login')
await page.locator('input[name="email"]').fill('...')
// ... etc
```

### 3. Use Test Fixtures for Authenticated Tests

```typescript
// ✅ Good - reuse authentication state
test.use({ storageState: 'playwright/.auth/user_1.json' })
test('fast test', async ({ page }) => {
  // Already authenticated!
})

// ❌ Avoid - signing in for every test
test('slow test', async ({ page }) => {
  await AuthHelper.signIn(page, 'user@example.com', 'password')
  // ... test code
})
```

### 4. Clean MailHog Between Tests

```typescript
test.beforeEach(async () => {
  // Clear emails to avoid interference
  await AuthHelper.clearMailHog()
})
```

### 5. Use Descriptive Test Names

```typescript
// ✅ Good - clear intent
test('should show validation error for email format', async ({ page }) => {

// ❌ Avoid - vague
test('email test', async ({ page }) => {
```

## Debugging

### Playwright Inspector

```bash
# Run with inspector
pnpm test:e2e:debug

# Or specific test
npx playwright test --debug tests/e2e/authentication.example.spec.ts
```

### Screenshots on Failure

Screenshots are automatically captured on test failure and stored in `test-results/`.

### Console Logs

```typescript
// Add console logging in tests
test('debug test', async ({ page }) => {
  page.on('console', (msg) => console.log('PAGE LOG:', msg.text()))

  // ... test code
})
```

### MailHog Web UI

View sent emails during test execution:

```
http://localhost:8025
```

## CI/CD Integration

### GitHub Actions Example

```yaml
name: E2E Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install dependencies
        run: pnpm install

      - name: Install Playwright Browsers
        run: npx playwright install --with-deps

      - name: Start MailHog
        run: |
          docker run -d -p 1025:1025 -p 8025:8025 mailhog/mailhog

      - name: Start Backend
        run: |
          cd ../wmf-nest
          pnpm dev &
          sleep 10

      - name: Start Frontend
        run: |
          pnpm dev &
          sleep 10

      - name: Run E2E Tests
        run: pnpm test:e2e

      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: playwright-report/
```

## Troubleshooting

### Tests Fail with "Cannot connect to backend"

Ensure `wmf-nest` backend is running on `localhost:3000`:

```bash
cd ../wmf-nest
pnpm dev
```

### MailHog Emails Not Received

Check MailHog is running:

```bash
mailhog  # Should start on ports 1025 (SMTP) and 8025 (Web UI)
```

Verify backend is configured to use MailHog SMTP:

```typescript
// wmf-nest config should use localhost:1025
```

### Authentication Fixtures Not Working

Regenerate authentication files:

```bash
# Delete existing auth files
rm -rf playwright/.auth/*.json

# Re-run tests (will generate new auth files)
pnpm test:e2e
```

### Timeouts on Email Verification

Increase timeout in test:

```typescript
const emailReceived = await AuthHelper.waitForEmailInMailHog(
  'user@example.com',
  'WMF account verification',
  30000 // Increase to 30 seconds
)
```

## Additional Resources

- [Playwright Documentation](https://playwright.dev)
- [Page Object Model Pattern](https://playwright.dev/docs/pom)
- [Authentication Test Plan](../specs/authentication-test-plan.md)
- [WMF Nuxt Architecture](.github/copilot-instructions.md)
