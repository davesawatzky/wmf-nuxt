# Winnipeg Music Festival - Authentication & Authorization Test Plan

## Application Overview

The Winnipeg Music Festival (WMF) registration system is a Nuxt 4 SPA that provides user authentication for multiple account types. The system uses:

- **GraphQL API** for authentication operations
- **Email verification** for new accounts via confirmation links
- **JWT tokens** stored in httpOnly cookies
- **Role-based access control** (user, admin)
- **MailHog** for email capture during development
- **Multiple user types**: Regular users, Private Teachers, School Teachers/Community Conductors

## Authentication Architecture

### Key Components

- **Frontend**: `app/pages/Login.vue` - Unified sign in/sign up page
- **Backend**: NestJS GraphQL API with mutations:
  - `signin` - Authenticate existing users
  - `signup` - Register new accounts
- **Email Service**: Confirmation emails sent to verify new accounts
- **Session Management**: JWT tokens in httpOnly cookies, validated server-side
- **Middleware**: `app/middleware/auth.global.ts` - Route protection

### User Account Types

1. **Regular User** - Individual registrant or parent
2. **Private Teacher** - Must select instrument(s), account approval required
3. **School Teacher/Community Conductor** - Group registration capabilities
4. **Admin** - System administration access

### Authentication Flow States

| State                   | Description                                               | Can Sign In                    | Email Required        |
| ----------------------- | --------------------------------------------------------- | ------------------------------ | --------------------- |
| Registered (Unverified) | Account created, email sent                               | ❌ No                          | ✅ Yes - Verification |
| Verified (Inactive)     | Email confirmed, pending approval (Private Teachers only) | ✅ Yes - Redirected to profile | ❌ No                 |
| Active                  | Fully approved account                                    | ✅ Yes - Full access           | ❌ No                 |
| Password Reset Pending  | User requested password change                            | ❌ No                          | ✅ Yes - Reset link   |

---

## Test Scenarios

### 1. New Account Registration

#### 1.1 Register Regular User Account

**Prerequisites:**

- MailHog running on `localhost:8025` (web UI) and `localhost:1025` (SMTP)
- Application running on `localhost:3001`
- Backend running on `localhost:3000`

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click "Sign up here" link
3. Verify form shows:
   - First Name field
   - Last Name field
   - Email field
   - Password field (with requirements text)
   - Re-enter Password field
   - "Private Teacher" checkbox (unchecked)
   - "School Teacher and/or Community Conductor" checkbox (unchecked)
   - "Register New Account" button
4. Fill in form:
   ```
   First Name: John
   Last Name: Doe
   Email: john.doe@test.com
   Password: Test123!@#
   Re-enter Password: Test123!@#
   ```
5. Click "Register New Account"

**Expected Results:**

- ✅ Toast notification: "Check EMAIL for account verification link"
- ✅ Form clears and returns to sign in view
- ✅ Email sent to MailHog (verify at `http://localhost:8025`)
- ✅ Email contains verification link with format: `http://localhost:3001/emailconfirmation?token=...`

**Database State:**

- User record created with `isActive: false`
- Role: `['user']`
- Email verification token stored

---

#### 1.2 Register Private Teacher Account

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click "Sign up here"
3. Check "Private Teacher" checkbox
4. Verify "Instrument(s)" dropdown appears
5. Fill in form:
   ```
   Private Teacher: ✓ (checked)
   First Name: Sarah
   Last Name: Smith
   Instrument(s): Piano (select from dropdown)
   Email: sarah.smith@test.com
   Password: Teacher456!@#
   Re-enter Password: Teacher456!@#
   ```
6. Click "Register New Account"

**Expected Results:**

- ✅ Toast notification: "Check EMAIL for account verification link"
- ✅ Email sent to MailHog
- ✅ Account created with `privateTeacher: true`
- ✅ `instrument` field populated
- ✅ `isActive: true`

**Special Behavior:**

- After email verification, teacher can sign in but is redirected to `/userinformation` to complete profile

---

#### 1.3 Register School Teacher/Community Conductor Account

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click "Sign up here"
3. Check "School Teacher and/or Community Conductor" checkbox
4. Fill in form:
   ```
   School Teacher: ✓ (checked)
   First Name: Michael
   Last Name: Johnson
   Email: michael.johnson@test.com
   Password: School789!@#
   Re-enter Password: School789!@#
   ```
5. Click "Register New Account"

**Expected Results:**

- ✅ Toast notification: "Check EMAIL for account verification link"
- ✅ Email sent to MailHog
- ✅ Account created with `schoolTeacher: true`
- ✅ Can register groups/choirs after verification

---

#### 1.4 Register Both Teacher Types

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click "Sign up here"
3. Check **both** "Private Teacher" and "School Teacher" checkboxes
4. Verify "Instrument(s)" dropdown appears
5. Fill in form with both teacher types selected
6. Click "Register New Account"

**Expected Results:**

- ✅ Account created with `privateTeacher: true` AND `schoolTeacher: true`
- ✅ Instrument field required and saved
- ✅ User can register both individual students and groups

---

### 2. Email Verification

#### 2.1 Verify New Account via Email Link

**Prerequisites:**

- Account registered but not verified (from scenario 1.1)
- Verification email received in MailHog

**Steps:**

1. Open MailHog web UI at `http://localhost:8025`
2. Click on the verification email for `john.doe@test.com`
3. Click the verification link in the email body
4. Browser opens to `http://localhost:3001/emailconfirmation?token=...`

**Expected Results:**

- ✅ Web page notification: "Email verified successfully" (or similar)
- ✅ After button click, redirect to `/login` page
- ✅ Database: `isActive: true` (for regular users)
- ✅ User can now sign in

**Database State After Verification:**

- Regular User: `isActive: true`
- Private Teacher: `isActive: false` (awaiting approval)
- School Teacher: `isActive: true`

---

#### 2.2 Verify with Expired Token

**Steps:**

1. Use a verification link from an old email (token expired)
2. Click the link

**Expected Results:**

- ✅ Error message: "Verification token expired"
- ✅ Option to request new verification email
- ✅ User remains unverified

---

#### 2.3 Verify with Invalid Token

**Steps:**

1. Manually modify the token in the URL:
   ```
   http://localhost:3001/emailconfirmation?token=invalid_token_12345
   ```
2. Navigate to the URL

**Expected Results:**

- ✅ Error message: "Invalid verification token"
- ✅ Redirect to login page
- ✅ User remains unverified

---

### 3. Sign In - Happy Path

#### 3.1 Sign In Regular User (Verified)

**Prerequisites:**

- Account registered and email verified
- User is active

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter credentials:
   ```
   Email: john.doe@test.com
   Password: Test123!@#
   ```
3. Click "Sign In" or press Enter

**Expected Results:**

- ✅ Successful authentication
- ✅ JWT token stored in httpOnly cookie
- ✅ Redirect to `/registrations` page
- ✅ User can view their registrations

---

#### 3.2 Sign In Private Teacher (Verified but Inactive)

**Prerequisites:**

- Private teacher account registered and email verified

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter credentials for private teacher account
3. Click "Sign In"

**Expected Results:**

- ✅ Sign in succeeds (authentication valid)
- ✅ Redirect to `/userinformation` page (not `/registrations`)

---

#### 3.3 Sign In Admin Account

**Prerequisites:**

- Admin account exists with role `['admin']`

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter admin credentials
3. Click "Sign In"

**Expected Results:**

- ✅ Successful authentication
- ✅ Redirect to `/admin` page (not `/registrations`)
- ✅ Access to admin dashboard
- ✅ Can approve pending teacher accounts

---

### 4. Sign In - Error Cases

#### 4.1 Sign In with Unverified Email

**Prerequisites:**

- Account registered but email NOT verified

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter credentials for unverified account
3. Click "Sign In"

**Expected Results:**

- ✅ Dialog appears: "Account not verified"
- ✅ Message: "This account needs to be verified before signing in. Check your email inbox and spam folders..."
- ✅ Buttons:
  - "Close" - Dismiss dialog
  - "Re-Send Verification" - Send new verification email
- ✅ Sign in blocked until verification

---

#### 4.2 Sign In with Incorrect Password

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter valid email but wrong password:
   ```
   Email: john.doe@test.com
   Password: WrongPassword123
   ```
3. Click "Sign In"

**Expected Results:**

- ✅ Toast notification: "Incorrect email or password."
- ✅ Form fields clear after 4 seconds
- ✅ User remains on login page
- ✅ No account lockout (security consideration: check backend implementation)

---

#### 4.3 Sign In with Non-Existent Email

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter email that doesn't exist:
   ```
   Email: nonexistent@test.com
   Password: AnyPassword123!
   ```
3. Click "Sign In"

**Expected Results:**

- ✅ Toast notification: "Incorrect email or password."
- ✅ Same error message as incorrect password (security best practice)
- ✅ No indication whether email exists or not

---

#### 4.4 Sign In with Password Reset Pending

**Prerequisites:**

- User has requested password reset
- Password reset email sent but not completed

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Enter credentials for account with pending password reset
3. Click "Sign In"

**Expected Results:**

- ✅ Dialog appears: "Password Change Pending"
- ✅ Message: "A password change has been requested on this account. Check your email inbox and spam folders..."
- ✅ Buttons:
  - "Close" - Dismiss dialog
  - "Re-Send Password Change Email" - Send new reset link
- ✅ Sign in blocked until password reset completed

---

### 5. Form Validation

#### 5.1 Sign Up - Empty Fields

**Steps:**

1. Navigate to login page
2. Click "Sign up here"
3. Click "Register New Account" without filling any fields

**Expected Results:**

- ✅ Validation errors displayed for all required fields:
  - "Please enter your first name"
  - "Please enter your last name"
  - "Please enter your email address"
  - "Please enter a password..."
  - "Please re-enter your password again"
- ✅ Submit blocked until all fields valid

---

#### 5.2 Sign Up - Invalid Email Format

**Steps:**

1. Navigate to login page
2. Click "Sign up here"
3. Enter invalid email:
   ```
   Email: notanemail
   ```
4. Fill other fields correctly
5. Blur email field

**Expected Results:**

- ✅ Validation error: "Email must be a valid email"
- ✅ Submit button remains disabled or shows error on submit

---

#### 5.3 Sign Up - Weak Password

**Test Cases:**

**a) Too Short**

```
Password: Test1!
Re-enter Password: Test1!
```

**Expected:** Error - "Password must be at least 8 characters"

**b) Missing Number**

```
Password: TestPass!@#
Re-enter Password: TestPass!@#
```

**Expected:** Error - "Password must contain at least one number"

**c) Missing Uppercase**

```
Password: testpass123!
Re-enter Password: testpass123!
```

**Expected:** Error - "Password must contain at least one uppercase letter"

**d) Missing Special Character**

```
Password: TestPass123
Re-enter Password: TestPass123
```

**Expected:** Error - "Password must contain at least one special character"

---

#### 5.4 Sign Up - Password Mismatch

**Steps:**

1. Navigate to login page
2. Click "Sign up here"
3. Enter different passwords:
   ```
   Password: Test123!@#
   Re-enter Password: Different456!@#
   ```
4. Fill other fields correctly
5. Click "Register New Account"

**Expected Results:**

- ✅ Validation error on password2 field: "Passwords must match"
- ✅ Submit blocked

---

#### 5.5 Sign Up - Private Teacher Without Instrument

**Steps:**

1. Navigate to login page
2. Click "Sign up here"
3. Check "Private Teacher" checkbox
4. Fill all fields EXCEPT instrument dropdown
5. Click "Register New Account"

**Expected Results:**

- ✅ Validation error: "Please select an instrument"
- ✅ Submit blocked until instrument selected

---

#### 5.6 Sign In - Empty Fields

**Steps:**

1. Navigate to login page (sign in view)
2. Click "Sign In" without entering credentials

**Expected Results:**

- ✅ Validation errors for email and password
- ✅ Submit blocked

---

### 6. Existing Teacher Account Check

#### 6.1 Register with Existing Teacher Email (No Password Set)

**Background:** Teachers can be pre-created in the system (e.g., imported from previous year) without passwords.

**Prerequisites:**

- Teacher record exists in database with email `existing.teacher@test.com`
- Teacher has NO password set (`hasPassword: false`)

**Steps:**

1. Navigate to login page
2. Click "Sign up here"
3. Check "Private Teacher"
4. Enter email of existing teacher: `existing.teacher@test.com`
5. Fill in password and other required fields
6. Click "Register New Account"

**Expected Results:**

- ✅ Account setup completes (NOT error "User already exists")
- ✅ Password is set on existing teacher record
- ✅ Verification email sent
- ✅ User must still verify email before signing in

**Code Reference:**

```typescript
// In Login.vue signup() function
if (teacherExistCheck.value) {
  await userStore.loadHasPassword(teacherExistCheck.value.id)
  if (userStore.checkPassword) {
    toast.error('User already exists')
    return null
  } else if (!userStore.checkPassword) {
    signupAccount() // Allows password setup
  }
}
```

---

#### 6.2 Register with Existing Teacher Email (Password Already Set)

**Prerequisites:**

- Teacher record exists with email `existing.teacher@test.com`
- Teacher already has a password set (`hasPassword: true`)

**Steps:**

1. Navigate to login page
2. Click "Sign up here"
3. Check "Private Teacher"
4. Enter email of existing teacher: `existing.teacher@test.com`
5. Fill in password and other fields
6. Click "Register New Account"

**Expected Results:**

- ✅ Toast error: "User already exists"
- ✅ Registration blocked
- ✅ User should use "Sign In" instead

---

#### 6.3 Register Non-Teacher with Existing Email

**Prerequisites:**

- User already registered with email `john.doe@test.com`
- User is NOT a teacher type

**Steps:**

1. Navigate to login page
2. Click "Sign up here"
3. Do NOT check teacher checkboxes
4. Enter existing email: `john.doe@test.com`
5. Fill in other fields
6. Click "Register New Account"

**Expected Results:**

- ✅ Backend error (likely from database unique constraint)
- ✅ Toast error: "Error signing up for account"
- ✅ Fields clear after 4 seconds
- ✅ User should use "Forgot password" if they forgot their credentials

---

### 7. Password Reset Flow

#### 7.1 Request Password Reset

**Prerequisites:**

- User account exists and is verified

**Steps:**

1. Navigate to `http://localhost:3001/login`
2. Click "Forgot your password?" link
3. Redirected to `/password/EmailVerification`
4. Enter email address
5. Click submit

**Expected Results:**

- ✅ Email sent to MailHog with password reset link
- ✅ Reset link format: `http://localhost:3001/password/reset?token=...`
- ✅ Toast notification confirming email sent
- ✅ User redirected or shown confirmation message

---

#### 7.2 Complete Password Reset

**Prerequisites:**

- Password reset email received in MailHog

**Steps:**

1. Open MailHog at `http://localhost:8025`
2. Find password reset email
3. Click reset link
4. Enter new password:
   ```
   New Password: NewPass123!@#
   Confirm Password: NewPass123!@#
   ```
5. Submit form

**Expected Results:**

- ✅ Password updated in database
- ✅ Old password no longer works
- ✅ Redirect to `/login`
- ✅ Toast notification: "Password updated successfully"
- ✅ User can sign in with new password

---

#### 7.3 Password Reset with Expired Token

**Steps:**

1. Use old password reset link (token expired)
2. Try to reset password

**Expected Results:**

- ✅ Error message: "Reset token expired"
- ✅ User must request new reset link

---

### 8. Resend Verification/Reset Emails

#### 8.1 Resend Verification Email from Dialog

**Prerequisites:**

- Account registered but not verified
- User attempts to sign in

**Steps:**

1. Navigate to login page
2. Enter credentials for unverified account
3. Click "Sign In"
4. Dialog appears: "Account not verified"
5. Click "Re-Send Verification" button

**Expected Results:**

- ✅ New verification email sent to MailHog
- ✅ New token generated
- ✅ Dialog closes
- ✅ Form fields cleared
- ✅ User can check email for new link

---

#### 8.2 Resend Password Reset Email from Dialog

**Prerequisites:**

- Password reset pending on account
- User attempts to sign in

**Steps:**

1. Navigate to login page
2. Enter credentials for account with pending reset
3. Click "Sign In"
4. Dialog appears: "Password Change Pending"
5. Click "Re-Send Password Change Email" button

**Expected Results:**

- ✅ New password reset email sent to MailHog
- ✅ New token generated
- ✅ Dialog closes
- ✅ Form fields cleared

---

## Test Data Matrix

| Account Type                       | Email                      | Password         | Private Teacher | School Teacher | Instrument | First Name | Last Name | Status After Verification   |
| ---------------------------------- | -------------------------- | ---------------- | --------------- | -------------- | ---------- | ---------- | --------- | --------------------------- |
| Regular User                       | `test.user@wmf.test`       | `Test123!@#`     | ❌ No           | ❌ No          | N/A        | John       | Doe       | Active                      |
| Private Teacher                    | `private.teacher@wmf.test` | `Teacher456!@#`  | ✅ Yes          | ❌ No          | Piano      | Sarah      | Smith     | Inactive (pending approval) |
| School Teacher                     | `school.teacher@wmf.test`  | `School789!@#`   | ❌ No           | ✅ Yes         | N/A        | Michael    | Johnson   | Active                      |
| Both Teachers                      | `both.teacher@wmf.test`    | `Both000!@#`     | ✅ Yes          | ✅ Yes         | Violin     | Emma       | Williams  | Inactive (pending approval) |
| Admin                              | `admin@wmf.test`           | `Admin999!@#`    | ❌ No           | ❌ No          | N/A        | Admin      | User      | Active                      |
| Unverified User                    | `unverified@wmf.test`      | `Unverified123!` | ❌ No           | ❌ No          | N/A        | Jane       | Pending   | Unverified                  |
| Pre-existing Teacher (no password) | `legacy.teacher@wmf.test`  | `null`           | ✅ Yes          | ❌ No          | Flute      | Legacy     | Teacher   | Inactive                    |

---

## Testing Environment Setup

### Prerequisites Checklist

**Backend (wmf-nest):**

- [ ] Running on `http://localhost:3000`
- [ ] GraphQL endpoint: `http://localhost:3000/graphql`
- [ ] Database connected and migrations run
- [ ] `.env.test` file configured with:
  - SMTP settings pointing to MailHog
  - JWT secret key
  - Database connection string

**Frontend (wmf-nuxt):**

- [ ] Running on `http://localhost:3001`
- [ ] `.env.test` file configured with:
  - Backend URL: `http://localhost:3000`
  - Stripe keys (if testing payments)
- [ ] Dependencies installed: `pnpm install`
- [ ] Dev server started: `pnpm dev`

**MailHog:**

- [ ] Installed (via Homebrew, Docker, or binary)
- [ ] Running on:
  - SMTP: `localhost:1025`
  - Web UI: `localhost:8025`
- [ ] Backend configured to send to MailHog SMTP

**Test Data:**

- [ ] No stale test accounts (or known test accounts documented)
- [ ] MailHog inbox cleared before testing

---

## Test Execution Commands

### Start Development Environment

```bash
# Terminal 1: Start MailHog
cd ~/go/bin
./MailHog

# Terminal 2: Start Backend (wmf-nest)
cd ../wmf-nest
pnpm start:test

# Terminal 3: Start Frontend (wmf-nuxt)
pnpm dev:test

# Terminal 4: Open MailHog UI
# open http://localhost:8025  # macOS
navigate to http://localhost:8025 in browser
```

### Automated Testing

```bash
# Run authentication E2E tests (Playwright)
pnpm test:e2e tests/e2e/authentication.spec.ts

# Run with UI
pnpm test:e2e:headed tests/e2e/authentication.spec.ts

# Run with debug
pnpm test:e2e:debug tests/e2e/authentication.spec.ts
```

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

## Success Criteria

### Minimum Acceptance Criteria

All authentication flows must:

- ✅ Complete without errors in happy path scenarios
- ✅ Handle all error cases gracefully
- ✅ Display appropriate user feedback (toasts, dialogs)
- ✅ Maintain data integrity (no duplicate accounts, no data loss)
- ✅ Enforce security best practices (password requirements, SQL injection prevention)
- ✅ Send properly formatted emails to MailHog
- ✅ Work across Chrome and Firefox browsers
- ✅ Be accessible via keyboard navigation

### Performance Benchmarks

- Sign in response: < 1 second
- Registration response: < 2 seconds
- Email delivery to MailHog: < 5 seconds
- Form validation feedback: Immediate (< 100ms)

### Security Checklist

- [ ] Passwords stored as hashed values (never plain text)
- [ ] JWT tokens in httpOnly cookies
- [ ] CSRF protection implemented
- [ ] SQL injection attempts blocked
- [ ] XSS attempts sanitized
- [ ] Rate limiting on email sends
- [ ] Session timeout enforced
- [ ] Password complexity requirements met

---

## Next Steps

After completing this authentication test plan:

1. **Document Results**
   - Create test report with pass/fail for each scenario
   - Log all bugs found
   - Prioritize issues by severity

2. **Automate Tests**
   - Convert manual tests to Playwright E2E tests
   - Add to CI/CD pipeline
   - Run on every pull request

3. **Expand Test Coverage**
   - Test registration form (separate from auth)
   - Test class selection and submission flows
   - Test payment integration with Stripe

4. **Production Readiness**
   - Replace MailHog with production email service
   - Review SMTP configuration
   - Test with real email addresses
   - Verify email deliverability (not in spam)

---

**Last Updated:** November 8, 2025
**Test Plan Version:** 1.0.0
**Application Version:** Nuxt 4 SPA (wmf-nuxt)
