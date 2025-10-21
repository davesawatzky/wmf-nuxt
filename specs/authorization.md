# WMF Registration - User Authentication Test Plan

## Application Overview

The WMF (Winnipeg Music Festival) registration application implements a secure authentication system with the following characteristics:

- **Authentication Method**: httpOnly JWT cookies (server-side validation)
- **Backend**: NestJS GraphQL API on `localhost:3000`
- **Frontend**: Nuxt 4 SPA on `localhost:3001`
- **State Management**: Pinia store with session persistence
- **Validation**: VeeValidate + Yup schemas with real-time feedback
- **Authorization**: Role-based access control (CASL) with permissions

### User Roles Available

- **USER** (Standard User - default role)
- **ADMIN** (System Administrator)

**Note:** Users can additionally have flags for **privateTeacher** and/or **schoolTeacher** status (boolean fields, not separate roles). A user can be:

- Private Teacher only (`privateTeacher: true, schoolTeacher: false`)
- School Teacher only (`privateTeacher: false, schoolTeacher: true`)
- Both (`privateTeacher: true, schoolTeacher: true`)
- Neither (`privateTeacher: false, schoolTeacher: false`)

### Key Features

- Email-based authentication with password complexity requirements
- Real-time validation with field-level error messages
- Teacher type selection during registration (checkboxes, not role selection)
- Automatic session management with httpOnly cookies
- Protected route middleware for authenticated-only pages

---

## Test Scenarios

### 1. User Registration - Happy Path

**Seed:** `tests/e2e/seed.spec.ts`

#### 1.1 Register New User as Private Teacher

**Prerequisites:**

- Application running on `localhost:3001`
- Backend API available on `localhost:3000`
- No existing user with test email

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Verify the sign-up form displays with:
   - Email input field
   - Password input field
   - Confirm Password input field
   - "Private Teacher" checkbox (unchecked by default)
   - "School Teacher" checkbox (unchecked by default)
   - "Sign Up" button (disabled initially)
4. Click in the email input field
5. Type a valid email address: `teacher.test@example.com`
6. Press Tab or click outside the field to trigger validation
7. Verify no error message appears for email field
8. Click in the password input field
9. Type a valid password: `ValidPass123!`
10. Press Tab to trigger validation
11. Verify no error message appears for password field
12. Click in the confirm password input field
13. Type the same password: `ValidPass123!`
14. Press Tab to trigger validation
15. Verify no error message appears for confirm password field
16. Check the "Private Teacher" checkbox
17. Verify checkbox is checked
18. Verify "Sign Up" button becomes enabled
19. Click "Sign Up" button
20. Wait for form submission and navigation

**Expected Results:**

- User is redirected to `/Form` page (registration form)
- Authentication cookie is set (visible in browser DevTools)
- Auth store contains user data:
  - Email: `teacher.test@example.com`
  - Role: `USER`
  - `privateTeacher: true`
  - `schoolTeacher: false`
  - `isActive: true`
- Success toast notification appears (if implemented)
- User can access protected routes

**Success Criteria:**

- Registration completes without errors
- User session is established
- Navigation to next step occurs automatically

---

#### 1.2 Register New User as School Teacher

**Prerequisites:**

- Application running on `localhost:3001`
- Backend API available on `localhost:3000`
- No existing user with test email

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Click in the email input field
4. Type: `school.teacher@example.com`
5. Press Tab
6. Click in the password input field
7. Type: `SchoolPass456!`
8. Press Tab
9. Click in the confirm password input field
10. Type: `SchoolPass456!`
11. Press Tab
12. Check the "School Teacher" checkbox
13. Verify checkbox is checked
14. Verify "Sign Up" button is enabled
15. Click "Sign Up" button
16. Wait for form submission

**Expected Results:**

- User is redirected to `/Form` page
- Auth store contains:
  - Email: `school.teacher@example.com`
  - Role: `USER`
  - `privateTeacher: false`
  - `schoolTeacher: true`
  - `isActive: true`
- Authentication session established

---

#### 1.3 Register New User as Both Private and School Teacher

**Prerequisites:**

- Application running on `localhost:3001`
- Backend API available on `localhost:3000`
- No existing user with test email

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `both.teacher@example.com`
4. Enter password: `BothTeacher789!`
5. Confirm password: `BothTeacher789!`
6. Check the "Private Teacher" checkbox
7. Check the "School Teacher" checkbox
8. Verify both checkboxes are checked
9. Click "Sign Up" button
10. Wait for form submission

**Expected Results:**

- User is redirected to `/Form` page
- Auth store contains:
  - Email: `both.teacher@example.com`
  - Role: `USER`
  - `privateTeacher: true`
  - `schoolTeacher: true`
  - `isActive: true`
- Authentication session established

---

### 2. User Registration - Validation Testing

#### 2.1 Email Validation

**Seed:** `tests/e2e/seed.spec.ts`

##### 2.1.1 Invalid Email Format

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Click in email field
4. Type: `notanemail`
5. Press Tab to trigger blur validation
6. Observe error message

**Expected Results:**

- Error message displays: "Invalid email"
- Email field shows error styling (red border/text)
- "Sign Up" button remains disabled

##### 2.1.2 Empty Email

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Click in email field
4. Leave empty and press Tab
5. Observe error message

**Expected Results:**

- Error message displays: "Email is required"
- "Sign Up" button remains disabled

##### 2.1.3 Email Already Exists

**Prerequisites:**

- Existing user with email `existing@example.com`

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `existing@example.com`
4. Enter valid password: `ValidPass123!`
5. Confirm password: `ValidPass123!`
6. Check "Private Teacher" checkbox (optional)
7. Click "Sign Up" button
8. Wait for server response

**Expected Results:**

- Error message from server displays (likely toast notification)
- User remains on sign-up page
- Form fields retain entered values
- User can modify email and retry

---

#### 2.2 Password Validation

**Seed:** `tests/e2e/seed.spec.ts`

##### 2.2.1 Password Too Short

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `test@example.com`
4. Enter password: `Short1!`
5. Press Tab to trigger validation

**Expected Results:**

- Error message displays: "Password must be at least 8 characters"
- Password field shows error styling
- "Sign Up" button remains disabled

##### 2.2.2 Password Missing Capital Letter

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `test@example.com`
4. Enter password: `nocapital123!`
5. Press Tab

**Expected Results:**

- Error message displays: "Password must have at least 1 capital letter"
- "Sign Up" button remains disabled

##### 2.2.3 Password Missing Number

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `test@example.com`
4. Enter password: `NoNumber!`
5. Press Tab

**Expected Results:**

- Error message displays: "Password must have at least 1 number"
- "Sign Up" button remains disabled

##### 2.2.4 Password Missing Symbol

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `test@example.com`
4. Enter password: `NoSymbol123`
5. Press Tab

**Expected Results:**

- Error message displays: "Password must have at least 1 symbol"
- "Sign Up" button remains disabled

##### 2.2.5 Passwords Don't Match

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `test@example.com`
4. Enter password: `ValidPass123!`
5. Press Tab
6. Enter confirm password: `DifferentPass123!`
7. Press Tab

**Expected Results:**

- Error message displays on confirm password field: "Passwords must match"
- "Sign Up" button remains disabled

##### 2.2.6 Empty Password Fields

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click on "Sign up here." button to display registration form
3. Enter email: `test@example.com`
4. Click in password field, then Tab (leave empty)
5. Observe error

**Expected Results:**

- Error message displays: "Password is required"
- "Sign Up" button remains disabled

---

### 3. User Login - Happy Path

**Seed:** `tests/e2e/seed.spec.ts`

#### 3.1 Successful Login with Existing User

**Prerequisites:**

- Existing user account:
  - Email: `existing.user@example.com`
  - Password: `ExistingPass123!`
  - Role: `USER`

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Verify login form displays with:
   - Email input field
   - Password input field
   - "Sign In" button
   - "Don't have an account? Sign Up" link
3. Click in email field
4. Type: `existing.user@example.com`
5. Press Tab
6. Click in password field
7. Type: `ExistingPass123!`
8. Press Enter or click "Sign In" button
9. Wait for authentication

**Expected Results:**

- User is redirected to `/Form` page (or last visited protected page)
- Authentication cookie is set
- Auth store populated with user data
- User can access all role-appropriate protected routes

---

#### 3.2 Login and Navigate to Protected Route

**Prerequisites:**

- Existing user account

**Steps:**

1. Navigate directly to `http://localhost:3001/Form` (protected route)
2. Verify redirect to `/login?redirect=/Form`
3. Enter valid credentials
4. Click "Sign In"

**Expected Results:**

- After successful login, user is redirected to `/Form` (original destination)
- Auth state is established
- User can interact with registration form

---

### 4. User Login - Validation & Error Testing

**Seed:** `tests/e2e/seed.spec.ts`

#### 4.1 Invalid Credentials

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter email: `nonexistent@example.com`
3. Enter password: `WrongPassword123!`
4. Click "Sign In"
5. Wait for server response

**Expected Results:**

- Error message displays: "Invalid credentials" or "Login failed"
- User remains on sign-in page
- No authentication cookie is set
- Auth store remains empty/unauthenticated state

---

#### 4.2 Empty Form Submission

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Leave email and password fields empty
3. Click "Sign In" button

**Expected Results:**

- Validation errors display for both fields:
  - Email: "Email is required"
  - Password: "Password is required"
- Form submission is prevented
- No API request is made

---

#### 4.3 Invalid Email Format on Login

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter email: `not-an-email`
3. Press Tab
4. Observe validation

**Expected Results:**

- Error message: "Invalid email"
- Field shows error styling
- User can correct and proceed

---

### 5. Session Management

**Seed:** `tests/e2e/seed.spec.ts`

#### 5.1 Session Persistence on Page Refresh

**Prerequisites:**

- Authenticated user session

**Steps:**

1. Log in successfully (see scenario 3.1)
2. Navigate to `/Form` page
3. Verify user is authenticated
4. Press F5 or click browser refresh button
5. Wait for page reload

**Expected Results:**

- User remains authenticated after refresh
- Auth store is repopulated from cookie
- User stays on `/Form` page (no redirect to login)
- Session data persists

---

#### 5.2 Logout Functionality

**Prerequisites:**

- Authenticated user session

**Steps:**

1. Log in successfully
2. Navigate to any protected page
3. Locate logout button/link in navigation
4. Click logout button
5. Wait for logout process

**Expected Results:**

- User is redirected to `/login` page
- Authentication cookie is cleared
- Auth store is reset to unauthenticated state
- Attempting to access protected routes redirects to login

---

#### 5.3 Session Expiration Handling

**Prerequisites:**

- Authenticated user session
- Backend configured with session timeout

**Steps:**

1. Log in successfully
2. Wait for session to expire (or manually invalidate cookie)
3. Attempt to navigate to protected route or perform authenticated action
4. Observe behavior

**Expected Results:**

- User is redirected to `/login` with appropriate message
- Auth store is cleared
- User must re-authenticate to continue

---

### 6. Route Protection & Authorization

**Seed:** `tests/e2e/seed.spec.ts`

#### 6.1 Access Protected Route While Unauthenticated

**Prerequisites:**

- No active user session (logged out or never logged in)

**Steps:**

1. Navigate directly to `http://localhost:3001/Form`
2. Observe redirect behavior

**Expected Results:**

- User is immediately redirected to `/login`
- URL includes redirect parameter: `/login?redirect=/Form`
- Page displays login form
- After login, user returns to `/Form`

---

#### 6.2 Role-Based Route Access

**Prerequisites:**

- Multiple user accounts with different roles
- Role-specific protected routes (e.g., `/admin` for ADMIN role)

**Steps:**

1. Log in as USER role user (not ADMIN)
2. Attempt to navigate to `/admin` route
3. Observe access control

**Expected Results:**

- If route is role-restricted, user sees 403/access denied or redirects
- Auth middleware enforces role-based permissions
- User can only access routes appropriate for their role

---

### 7. Navigation & User Experience

**Seed:** `tests/e2e/seed.spec.ts`

#### 7.1 Toggle Between Sign In and Sign Up Forms

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Verify sign-in form is displayed by default
3. Locate "Don't have an account? Sign up here." button
4. Click the button
5. Verify registration form is displayed
6. Locate "Back to Sign In" button
7. Click the button
8. Verify navigation back to sign-in form

**Expected Results:**

- Smooth toggling between authentication forms on same page
- Form fields are cleared on toggle
- No authentication state is created during navigation

---

#### 7.2 Back Button Behavior After Login

**Prerequisites:**

- Authenticated user session

**Steps:**

1. Navigate to `/login`
2. Log in successfully
3. Verify redirect to `/Form`
4. Click browser back button
5. Observe behavior

**Expected Results:**

- User should NOT return to login page (since already authenticated)
- Either stays on current page or navigates to appropriate authenticated page
- No logout occurs from back button usage

---

### 8. Error Handling & Edge Cases

**Seed:** `tests/e2e/seed.spec.ts`

#### 8.1 Network Failure During Registration

**Prerequisites:**

- Backend API stopped or network blocked

**Steps:**

1. Navigate to `/login`
2. Click on "Sign up here." button to display registration form
3. Fill in valid registration form
4. Stop backend server or simulate network failure
5. Click "Sign Up" button
6. Observe error handling

**Expected Results:**

- User-friendly error message displays
- Form data is retained (not cleared)
- User can retry submission when network recovers
- No partial account creation occurs

---

#### 8.2 Network Failure During Login

**Prerequisites:**

- Backend API stopped or network blocked

**Steps:**

1. Navigate to `/login`
2. Enter valid credentials for existing user
3. Stop backend server or simulate network failure
4. Click "Sign In" button
5. Observe error handling

**Expected Results:**

- Error message displays: "Unable to connect to server" or similar
- Login form remains populated
- User can retry when network recovers
- No authentication state is created

---

#### 8.3 XSS Prevention in Form Fields

**Steps:**

1. Navigate to `/login`
2. Click on "Sign up here." button to display registration form
3. Enter email with script tags: `<script>alert('xss')</script>@test.com`
4. Enter valid password
5. Attempt to submit form

**Expected Results:**

- Either validation rejects the malformed email
- Or backend sanitizes input and prevents script execution
- No JavaScript execution occurs from user input

---

#### 8.4 SQL Injection Prevention

**Steps:**

1. Navigate to `/login`
2. Enter email: `admin@test.com' OR '1'='1`
3. Enter password: `' OR '1'='1`
4. Click "Sign In"

**Expected Results:**

- Login fails with invalid credentials message
- No SQL injection occurs (backend uses parameterized queries)
- No unauthorized access is granted

---

### 9. Accessibility Testing

**Seed:** `tests/e2e/seed.spec.ts`

#### 9.1 Keyboard Navigation on Sign-Up Form

**Steps:**

1. Navigate to `/login`
2. Click on "Sign up here." button to display registration form
3. Press Tab key repeatedly
4. Verify focus moves in logical order:
   - Email field → Password field → Confirm Password field → Private Teacher checkbox → School Teacher checkbox → Sign Up button
5. Use Space key to check/uncheck checkboxes
6. Press Enter on "Sign Up" button to submit

**Expected Results:**

- All interactive elements are keyboard accessible
- Focus indicators are visible
- Form can be completed without mouse
- Tab order is logical and intuitive

---

#### 9.2 Screen Reader Compatibility

**Prerequisites:**

- Screen reader software (NVDA, JAWS, or VoiceOver)

**Steps:**

1. Enable screen reader
2. Navigate to `/login`
3. Click on "Sign up here." button to display registration form
4. Listen to form element announcements
5. Trigger validation errors
6. Listen to error announcements

**Expected Results:**

- Form labels are properly associated with inputs
- Field purposes are announced clearly
- Validation errors are announced to screen reader
- Teacher type checkboxes are clearly identified and announced
- Checkbox states (checked/unchecked) are announced
- Button states (enabled/disabled) are announced

---

### 10. Multi-Browser Testing

**Seed:** `tests/e2e/seed.spec.ts`

#### 10.1 Registration Flow Across Browsers

**Browsers to Test:**

- Chromium
- Firefox
- WebKit (Safari)
- Mobile Chrome (responsive)

**Steps:**

1. Repeat scenario 1.1 (Register New User as Private Teacher) in each browser
2. Verify consistent behavior across all browsers

**Expected Results:**

- Registration works identically in all browsers
- Cookie-based authentication functions consistently
- UI renders correctly without browser-specific issues
- Form validation behaves consistently

---

## Test Data Requirements

### Pre-seeded Test Users

Create these users in the backend database for login testing:

```javascript
const testUsers = [
  {
    email: 'teacher.one@wmf-test.com',
    password: 'TeacherPass1!',
    role: 'USER',
    privateTeacher: true,
    schoolTeacher: false,
    instrument: Piano,
    isActive: true,
  },
  {
    email: 'school.teacher@wmf-test.com',
    password: 'SchoolPass2!',
    role: 'USER',
    privateTeacher: false,
    schoolTeacher: true,
    isActive: true,
  },
  {
    email: 'both.teacher@wmf-test.com',
    password: 'BothTeacher3!',
    role: 'USER',
    privateTeacher: true,
    schoolTeacher: true,
    instrument: Flute,
    isActive: true,
  },
  {
    email: 'regular.user@wmf-test.com',
    password: 'RegularUser4!',
    role: 'USER',
    privateTeacher: false,
    schoolTeacher: false,
    isActive: true,
  },
  {
    email: 'admin.user@wmf-test.com',
    password: 'AdminPass5!',
    role: 'ADMIN',
    privateTeacher: false,
    schoolTeacher: false,
    isActive: true,
  },
]
```

### Dynamic Test Emails

For registration scenarios, use timestamped emails to avoid conflicts:

```javascript
const timestamp = Date.now()
const testEmail = `test.user.${timestamp}@wmf-test.com`
```

---

## Automation Guidelines

### Page Object Pattern

Use the existing `AuthPage` class structure:

```typescript
// tests/pageObjects/authPage.ts
class AuthPage extends HelperBase {
  async navigateToLogin() {
    /* ... */
  }
  async showRegistrationForm() {
    /* ... */
  }
  async fillRegistrationForm(email, password, privateTeacher, schoolTeacher) {
    /* ... */
  }
  async submitRegistration() {
    /* ... */
  }
  async verifySuccessfulAuth() {
    /* ... */
  }
  async verifyValidationError(field, message) {
    /* ... */
  }
}
```

### Test Fixtures

Leverage Playwright fixtures for authentication state:

```typescript
// playwright/fixtures.ts
test.use({
  storageState: 'playwright/.auth/user_1.json',
})
```

### Assertions

Key assertions to include in automated tests:

```typescript
// Successful authentication
await expect(page).toHaveURL(/\/Form/)
await expect(page.locator('[data-testid="user-email"]')).toContainText(email)

// Validation errors
await expect(page.locator('.error-message')).toContainText(
  'Password is required'
)

// Button states
await expect(page.locator('button[type="submit"]')).toBeDisabled()
```

---

## Test Execution Priority

### P0 (Critical - Must Pass)

- Scenario 1.1: Register New User as Private Teacher
- Scenario 3.1: Successful Login with Existing User
- Scenario 5.2: Logout Functionality
- Scenario 6.1: Access Protected Route While Unauthenticated

### P1 (High Priority)

- All validation scenarios (2.1, 2.2)
- Scenario 4.1: Invalid Credentials
- Scenario 5.1: Session Persistence on Page Refresh

### P2 (Medium Priority)

- Teacher type registration scenarios (1.2, 1.3)
- Navigation scenarios (7.1, 7.2)
- Error handling scenarios (8.1, 8.2)

### P3 (Nice to Have)

- Security scenarios (8.3, 8.4)
- Accessibility testing (9.1, 9.2)
- Multi-browser testing (10.1)

---

## Implementation Checklist

- [ ] Set up test database with pre-seeded users
- [ ] Implement Page Object classes for auth flows
- [ ] Create reusable authentication fixtures
- [ ] Implement validation testing with blur events
- [ ] Add network failure simulation tests
- [ ] Configure multi-browser test matrix
- [ ] Add accessibility testing with axe-core
- [ ] Document CI/CD integration requirements
- [ ] Create test data cleanup scripts
- [ ] Add visual regression testing for auth pages

---

## Notes

1. **Backend Dependency**: All tests require `wmf-nest` backend running on `localhost:3000`
2. **Cookie Authentication**: Tests must handle httpOnly cookies correctly
3. **VeeValidate Timing**: Field validation requires proper blur events or form submission
4. **GraphQL Errors**: Backend returns `userErrors` array in responses
5. **Session Storage**: Frontend persists some state to sessionStorage
6. **Role Permissions**: CASL handles authorization after authentication
7. **Test Isolation**: Each test should create unique users or use dedicated test accounts
8. **Cleanup**: Consider implementing test data cleanup between runs

---

## Success Metrics

A successful authentication test suite should achieve:

- ✅ 100% coverage of authentication user flows
- ✅ All validation rules tested and verified
- ✅ Error handling tested for network failures
- ✅ Security vulnerabilities checked (XSS, SQL injection)
- ✅ Cross-browser compatibility verified
- ✅ Accessibility standards met (WCAG 2.1 AA)
- ✅ Tests run reliably in CI/CD pipeline
- ✅ Clear failure messages for debugging
