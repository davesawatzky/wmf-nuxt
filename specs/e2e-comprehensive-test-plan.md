# WMF Nuxt - Comprehensive E2E Test Plan

## Application Overview

The Winnipeg Music Festival (WMF) application is a Nuxt 4 SPA backed by a NestJS GraphQL API. Authentication, email verification, and password reset are already covered in `specs/authentication-test-plan.md` and `tests/e2e/auth/`. This plan extends E2E coverage to the remaining core workflows: creating and completing multi-step registrations (Solo, Group, School, Community performer types via `app/pages/Form.vue`), selecting festival classes, managing and resuming existing registrations, teacher student management (`app/pages/Students/`), submission/confirmation and Stripe payment (`app/pages/Submission/`), the admin dashboard and reports (`app/pages/admin/`), cross-cutting route protection/access control, and resilience to backend/network failures. Tests should reuse `PageManager`, `AuthHelper`/`TEST_USERS`, and the existing Page Object Model, adding new page objects only for screens not yet modeled (Form stepper, Students, Submission, Admin).

## Test Scenarios

### 1. Registration Creation & Performer Type Selection

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created - signs in as TEST_USERS.REGULAR_USER and lands on /registrations)`

#### 1.1. Create a new Solo registration

**File:** `tests/e2e/registration/registrationCreation.spec.ts`

**Steps:**
  1. From the Registrations page, click the Solo performer type card/button
    - expect: A new registration is created
    - expect: User is navigated to /Form with the 'Performer' tab active
  2. Reload the Registrations page
    - expect: The newly created draft registration appears in the registrations list with a 'saved'/draft status

#### 1.2. Create a new Group registration

**File:** `tests/e2e/registration/registrationCreation.spec.ts`

**Steps:**
  1. From the Registrations page, click the Group performer type card/button
    - expect: A new registration is created with performer type GROUP
    - expect: User is navigated to /Form with the 'Group' tab active

#### 1.3. Create a new School registration

**File:** `tests/e2e/registration/registrationCreation.spec.ts`

**Steps:**
  1. Sign in as a school-teacher account and click the School performer type card/button
    - expect: A new registration is created with performer type SCHOOL
    - expect: User is navigated to /Form with the 'School' tab active

#### 1.4. Create a new Community registration

**File:** `tests/e2e/registration/registrationCreation.spec.ts`

**Steps:**
  1. Sign in as a school-teacher account and click the Community performer type card/button
    - expect: A new registration is created with performer type COMMUNITY
    - expect: User is navigated to /Form with the 'Community' tab active

#### 1.5. Navigating to /Form without an active registration redirects home

**File:** `tests/e2e/registration/registrationCreation.spec.ts`

**Steps:**
  1. Sign in, then navigate directly to /Form without creating or loading a registration
    - expect: User is redirected to /Registrations

### 2. Solo Registration Flow

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created)`

#### 2.1. Complete solo registration happy path

**File:** `tests/e2e/registration/soloRegistration.spec.ts`

**Steps:**
  1. Create a new Solo registration and fill in required performer info (name, birthdate, etc.) on the Performer tab
    - expect: Fields save without validation errors
    - expect: Next tab becomes available
  2. Advance to the Teacher tab and select/confirm the private teacher
    - expect: Teacher selection is saved
    - expect: No validation errors shown
  3. Advance to the Solo Classes tab and add at least one class
    - expect: Selected class appears in the registered classes list with correct fee
  4. Advance to the Summary tab
    - expect: Summary shows performer, teacher, and selected class details matching what was entered

#### 2.2. Validation errors for missing required performer fields

**File:** `tests/e2e/registration/soloRegistration.spec.ts`

**Steps:**
  1. Create a new Solo registration and attempt to advance from the Performer tab without filling required fields
    - expect: Inline validation errors are shown for each missing required field
    - expect: User remains on the Performer tab

#### 2.3. Navigate back and forward between steps preserves data

**File:** `tests/e2e/registration/soloRegistration.spec.ts`

**Steps:**
  1. Fill the Performer tab, advance to Teacher, then click back to Performer
    - expect: Previously entered performer data is still populated

#### 2.4. Autosave restores in-progress solo registration after reload

**File:** `tests/e2e/registration/soloRegistration.spec.ts`

**Steps:**
  1. Fill part of the Performer tab, then reload the browser
    - expect: The registration reloads on the same tab/step
    - expect: Previously entered field values are restored
    - expect: Autosave status indicator shows saved state

### 3. Group Registration Flow

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created)`

#### 3.1. Complete group registration happy path

**File:** `tests/e2e/registration/groupRegistration.spec.ts`

**Steps:**
  1. Create a new Group registration, fill Group info, add two or more performers, assign a teacher, select classes, and reach Summary
    - expect: Summary lists all group performers, teacher, and selected classes correctly

#### 3.2. Add and remove multiple performers in a group

**File:** `tests/e2e/registration/groupRegistration.spec.ts`

**Steps:**
  1. On the Performers tab, add three performers then remove the second one
    - expect: Only the remaining two performers are listed
    - expect: Removed performer's data does not appear in later steps

#### 3.3. Validation errors for group info and teacher fields

**File:** `tests/e2e/registration/groupRegistration.spec.ts`

**Steps:**
  1. Attempt to advance from Group info tab without required fields, then without selecting a teacher on the Teacher tab
    - expect: Validation errors block advancing on each tab until corrected

### 4. School Registration Flow

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created - signs in as a school-teacher account)`

#### 4.1. Complete school registration with multiple school groups

**File:** `tests/e2e/registration/schoolRegistration.spec.ts`

**Steps:**
  1. Create a new School registration, fill School info, add two school groups, assign a teacher, select classes for each group, and reach Summary
    - expect: Summary lists school info, both groups, teacher, and selected classes correctly

#### 4.2. Validation errors for school info and teacher fields

**File:** `tests/e2e/registration/schoolRegistration.spec.ts`

**Steps:**
  1. Attempt to advance from School info tab without required fields
    - expect: Validation errors are shown and the user cannot advance

### 5. Community Registration Flow

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created - signs in as a school/community-teacher account)`

#### 5.1. Complete community registration with multiple community groups

**File:** `tests/e2e/registration/communityRegistration.spec.ts`

**Steps:**
  1. Create a new Community registration, fill Community info, add a community group, assign a contact/teacher, select classes, and reach Summary
    - expect: Summary lists community info, group, contact, and selected classes correctly

#### 5.2. Validation errors for community info and contact fields

**File:** `tests/e2e/registration/communityRegistration.spec.ts`

**Steps:**
  1. Attempt to advance from Community info tab without required fields
    - expect: Validation errors are shown and the user cannot advance

### 6. Festival Class Selection

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created)`

#### 6.1. Search and select classes for a performer

**File:** `tests/e2e/registration/classSelection.spec.ts`

**Steps:**
  1. On the Classes tab, search for a class by name/category and select it
    - expect: Class is added to the registered classes list with correct fee and class number

#### 6.2. Remove a selected class

**File:** `tests/e2e/registration/classSelection.spec.ts`

**Steps:**
  1. Remove a previously selected class from the registered classes list
    - expect: Class no longer appears in the list
    - expect: Total fee updates accordingly

#### 6.3. At least one class required to proceed to Summary

**File:** `tests/e2e/registration/classSelection.spec.ts`

**Steps:**
  1. Attempt to advance to Summary without selecting any class
    - expect: User cannot advance, or Summary indicates no classes selected
    - expect: An appropriate validation message is shown

#### 6.4. Duplicate or ineligible class selection is rejected

**File:** `tests/e2e/registration/classSelection.spec.ts`

**Steps:**
  1. Attempt to select the same class twice for the same performer, and attempt to select a class the performer is ineligible for (e.g. age/instrument restriction)
    - expect: Duplicate selection is prevented or flagged
    - expect: Ineligible class selection is blocked with an explanatory message

### 7. Multi-step Form Navigation, Autosave & Responsive Behavior

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created)`

#### 7.1. Step tabs reflect performer type and validation state

**File:** `tests/e2e/registration/formNavigation.spec.ts`

**Steps:**
  1. Create registrations of each performer type and inspect the visible tab names
    - expect: Tab set matches the performer type (Solo, Group, School, Community) as defined in Form.vue
  2. Leave a required field empty on one tab and switch to another tab
    - expect: The tab with the error shows a visible error indicator

#### 7.2. Refreshing mid-form resumes on the last active tab

**File:** `tests/e2e/registration/formNavigation.spec.ts`

**Steps:**
  1. Navigate to the third tab of a registration, then reload the page
    - expect: The form reopens on the same tab (session-storage restored)

#### 7.3. Swipe gesture navigates tabs on mobile viewport

**File:** `tests/e2e/registration/formNavigation.spec.ts`

**Steps:**
  1. Resize the viewport to a mobile size and perform a left/right swipe gesture on the form area
    - expect: Swiping left advances to the next tab
    - expect: Swiping right returns to the previous tab
    - expect: Swiping does not go before the first or past the last tab

### 8. Managing Existing Registrations

**Seed:** `tests/e2e/registration/seed.spec.ts (to be created)`

#### 8.1. Registrations list shows all registrations for the signed-in user

**File:** `tests/e2e/registration/existingRegistrations.spec.ts`

**Steps:**
  1. Create two registrations of different performer types, then reload /Registrations
    - expect: Both registrations are listed with correct labels/performer types

#### 8.2. Resume and edit a draft registration

**File:** `tests/e2e/registration/existingRegistrations.spec.ts`

**Steps:**
  1. Click an existing draft registration from the list
    - expect: User is navigated to /Form with previously saved data pre-populated
  2. Edit a field and advance through the remaining tabs
    - expect: Edited value persists through Summary

#### 8.3. Submitted registration is read-only

**File:** `tests/e2e/registration/existingRegistrations.spec.ts`

**Steps:**
  1. Open a registration that has already been submitted
    - expect: Form fields are disabled or the user is redirected to a summary/view-only page
    - expect: No edit controls are available

### 9. Teacher Student Management

**Seed:** `tests/e2e/students/seed.spec.ts (to be created - signs in as TEST_USERS.PRIVATE_TEACHER or SCHOOL_TEACHER)`

#### 9.1. Teacher views list of student registrations

**File:** `tests/e2e/students/studentManagement.spec.ts`

**Steps:**
  1. Navigate to /Students as a teacher account
    - expect: A list of student registrations linked to the teacher is displayed

#### 9.2. Teacher opens a student's registration summary

**File:** `tests/e2e/students/studentManagement.spec.ts`

**Steps:**
  1. Click a student registration from the list
    - expect: User is navigated to /students/summary showing that student's performer, classes, and teacher details

#### 9.3. Non-teacher account cannot access /Students

**File:** `tests/e2e/students/studentManagement.spec.ts`

**Steps:**
  1. Sign in as TEST_USERS.REGULAR_USER and navigate directly to /Students
    - expect: User is redirected away or shown an access-restricted state, per the 'user' middleware and role rules

### 10. Submission & Confirmation

**Seed:** `tests/e2e/submission/seed.spec.ts (to be created - completes a registration up to Submission)`

#### 10.1. All confirmation checkboxes required before proceeding to payment

**File:** `tests/e2e/submission/submissionConfirmation.spec.ts`

**Steps:**
  1. On /Submission, check some but not all confirmation checkboxes
    - expect: 'Proceed to Payment' button remains disabled
  2. Check all remaining confirmation checkboxes
    - expect: 'Proceed to Payment' button becomes enabled

#### 10.2. Parent/guardian consent checkbox appears for a performer under 18

**File:** `tests/e2e/submission/submissionConfirmation.spec.ts`

**Steps:**
  1. Submit a Solo registration where the performer's age is under 18, then view /Submission
    - expect: The parent/guardian consent checkbox is visible and required
  2. View /Submission for a Solo registration where the performer is 18 or older
    - expect: The parent/guardian consent checkbox is not shown (auto-confirmed)

#### 10.3. Cancel returns to Registrations without submitting

**File:** `tests/e2e/submission/submissionConfirmation.spec.ts`

**Steps:**
  1. On /Submission, click Cancel before completing checkboxes
    - expect: User is returned to /Registrations
    - expect: Registration remains in draft (not confirmed/submitted) state

#### 10.4. Direct navigation to /Submission without a confirmable registration redirects

**File:** `tests/e2e/submission/submissionConfirmation.spec.ts`

**Steps:**
  1. Navigate directly to /Submission with no active registration, or one already submitted
    - expect: User is redirected to /Registrations

### 11. Payment

**Seed:** `tests/e2e/submission/seed.spec.ts (to be created - registration confirmed, ready for payment)`

#### 11.1. Pay by cash generates a confirmation number

**File:** `tests/e2e/submission/payment.spec.ts`

**Steps:**
  1. On /Submission/payment, select the cash payment option and submit
    - expect: User is navigated to /Submission/result
    - expect: A confirmation number is displayed
    - expect: No Stripe payment element is shown

#### 11.2. Pay by credit card renders the Stripe payment element

**File:** `tests/e2e/submission/payment.spec.ts`

**Steps:**
  1. Select the credit card payment option
    - expect: Stripe Payment Element mounts and is interactive
    - expect: Submit button is disabled until the element finishes loading

#### 11.3. Successful credit card payment shows the confirmation result page

**File:** `tests/e2e/submission/payment.spec.ts`

**Steps:**
  1. Enter Stripe test card details for a successful payment and submit
    - expect: User is navigated to /Submission/result
    - expect: Payment intent status shows succeeded/complete
    - expect: Confirmation number and registration summary are displayed

#### 11.4. Declined card shows an error and allows retry

**File:** `tests/e2e/submission/payment.spec.ts`

**Steps:**
  1. Enter a Stripe test card number that simulates a decline and submit
    - expect: An error message is shown on the payment page
    - expect: User remains on /Submission/payment and can retry with different details

### 12. Admin Dashboard & Reports

**Seed:** `tests/e2e/admin/seed.spec.ts (to be created - signs in as TEST_USERS.ADMIN)`

#### 12.1. Admin dashboard loads for an admin user

**File:** `tests/e2e/admin/adminDashboard.spec.ts`

**Steps:**
  1. Navigate to /admin as an admin user
    - expect: Admin layout renders with the Dashboard heading and admin navigation

#### 12.2. Non-admin user is blocked from /admin

**File:** `tests/e2e/admin/adminDashboard.spec.ts`

**Steps:**
  1. Sign in as TEST_USERS.REGULAR_USER and navigate directly to /admin
    - expect: User is redirected away from /admin (e.g. to /registrations or /login)

#### 12.3. Admin can view and filter the registrations list

**File:** `tests/e2e/admin/adminRegistrations.spec.ts`

**Steps:**
  1. Navigate to /admin/registrations and view Classes, Participants, and Teachers tabs
    - expect: Each tab loads corresponding data tables without errors
  2. Apply an available filter or search on the Participants tab
    - expect: Results narrow to match the filter criteria

#### 12.4. Admin reports show Classes, Participants, Teachers, and Schedule

**File:** `tests/e2e/admin/adminReports.spec.ts`

**Steps:**
  1. Navigate to /admin/reports and open each of the Classes, Participants, Teachers, and Schedule tabs
    - expect: Each report tab renders its respective data without console errors

### 13. Access Control Across Roles

**Seed:** `tests/e2e/seed.spec.ts`

#### 13.1. Unauthenticated user is redirected to /login from protected routes

**File:** `tests/e2e/accessControl/routeGuards.spec.ts`

**Steps:**
  1. While signed out, navigate directly to /registrations, /Form, /Students, /Submission, /Submission/payment, and /admin
    - expect: Each route redirects to /login

#### 13.2. Inactive teacher account is restricted from teacher-only pages

**File:** `tests/e2e/accessControl/routeGuards.spec.ts`

**Steps:**
  1. Sign in as an unapproved TEST_USERS.PRIVATE_TEACHER (isActive: false) and attempt to reach a teacher-only page/action
    - expect: User is blocked or redirected with a message indicating pending approval

### 14. Error Handling & Resilience

**Seed:** `tests/e2e/seed.spec.ts`

#### 14.1. GraphQL failure on Registrations page shows an error toast

**File:** `tests/e2e/resilience/errorHandling.spec.ts`

**Steps:**
  1. Mock the registrations GraphQL query to fail, then load /Registrations
    - expect: An error toast is shown ('Error loading registrations...')
    - expect: Page does not crash and remains usable

#### 14.2. GraphQL failure while loading an existing registration is handled

**File:** `tests/e2e/resilience/errorHandling.spec.ts`

**Steps:**
  1. Mock a failure for loadRegistration's underlying query, then click an existing registration
    - expect: An error toast is shown
    - expect: User remains on /Registrations rather than being sent to a broken /Form

#### 14.3. Session expiry mid-form redirects to login

**File:** `tests/e2e/resilience/errorHandling.spec.ts`

**Steps:**
  1. While filling out the registration form, clear the auth cookie to simulate session expiry, then trigger a save action
    - expect: User is redirected to /login
    - expect: No unhandled errors appear in the console
