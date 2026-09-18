// spec: specs/e2e-comprehensive-test-plan.md
// seed: tests/e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Payment', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  async function signIn(page: import('@playwright/test').Page, userEmail: string, userPassword: string) {
    await page.goto('http://localhost:3001/login')
    await page.getByText('Sign In').first().waitFor({ state: 'visible' })
    await page.getByRole('textbox', { name: 'Email' }).fill(userEmail)
    await page.getByRole('textbox', { name: 'Password' }).fill(userPassword)
    await page.getByRole('button', { name: 'Sign In' }).click()
  }

  // Builds a fresh Solo registration from scratch (Performer -> Teacher -> Solo Classes -> Summary)
  // and returns after clicking "Prepare to Submit", landing on /Submission with a valid, submittable
  // registration ready to go. Each payment scenario needs its own un-submitted registration because
  // a successful credit-card payment permanently locks/submits the registration.
  async function buildSoloRegistrationToSubmission(page: import('@playwright/test').Page, label: string) {
    await page.goto('http://localhost:3001/Registrations')
    await page.getByRole('button', { name: 'New Solo Registration' }).click()
    await page.getByRole('button', { name: 'I Understand' }).click()

    await page.getByRole('textbox', { name: 'First Name' }).first().fill(label)
    await page.getByRole('textbox', { name: 'Last Name' }).first().fill('Payer')
    await page.getByRole('textbox', { name: 'Age' }).fill('30')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).first().fill('2045558888')
    await page.getByRole('textbox', { name: 'Email' }).first().fill(`${label.toLowerCase()}.payer@test.com`)
    await page.getByLabel('Instrument').selectOption('PIANO')
    await page.getByText('Photo Permission').click()
    await page.getByRole('button', { name: 'Yes' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // Teacher tab: search for and select the "Unlisted Teacher" option
    await page.getByRole('combobox').first().click()
    await page.getByRole('combobox').first().fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()
    await page.getByRole('textbox', { name: 'First Name' }).fill('Jane')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551234')
    await page.getByRole('textbox', { name: 'Email' }).fill(`jane.smith.${label.toLowerCase()}@test.com`)
    await page.getByRole('heading', { name: 'Teacher Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // Solo Classes tab: PIANO / PIANO SOLO / GRADE/LEVEL 4 / OWN CHOICE
    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 4')
    await page.getByLabel('Category').selectOption('OWN CHOICE')
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Sonata in C')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Mozart')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:30')
    await page.getByRole('heading', { name: 'Class Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // Summary tab
    await page.getByRole('button', { name: 'Prepare to Submit' }).click()
    await expect(page).toHaveURL('http://localhost:3001/Submission')

    await page.locator('#important-notes').nth(1).click()
    await page.locator('#nonrefundable').nth(1).click()
    await page.locator('#rules-and-trophy-forms').nth(1).click()
    await page.getByRole('button', { name: 'Proceed to Payment' }).click()
    await expect(page).toHaveURL('http://localhost:3001/Submission/payment')
  }

  test('Pay by cash generates a confirmation number', async ({ page }) => {
    await signIn(page, email, password)
    await buildSoloRegistrationToSubmission(page, 'Cash')

    await page.getByRole('button', { name: 'Cash, Cheque, E-Transfer' }).click()
    await page.getByRole('button', { name: 'Submit Payment' }).click()

    await expect(page).toHaveURL(/\/Submission\/result/)
    await expect(page.getByText(/WMF-\d+-\d+/)).toBeVisible()
    await expect(page.getByRole('button', { name: 'Return to Registrations' })).toBeVisible()
  })

  test('Pay by credit card renders the Stripe payment element', async ({ page }) => {
    await signIn(page, email, password)
    await buildSoloRegistrationToSubmission(page, 'Element')

    await page.getByRole('button', { name: 'Credit Card' }).click()

    const stripeFrame = page.locator('iframe[name^="__privateStripeFrame"]').first().contentFrame()
    await expect(stripeFrame.getByRole('textbox', { name: 'Card number' })).toBeVisible()
    await expect(stripeFrame.getByRole('textbox', { name: 'Expiration date' })).toBeVisible()
    await expect(stripeFrame.getByRole('textbox', { name: 'Security code' })).toBeVisible()
  })

  test('Successful credit card payment shows a confirmation result page', async ({ page }) => {
    await signIn(page, email, password)
    await buildSoloRegistrationToSubmission(page, 'Success')

    await page.getByRole('button', { name: 'Credit Card' }).click()

    const stripeFrame = page.locator('iframe[name^="__privateStripeFrame"]').first().contentFrame()
    await stripeFrame.getByRole('textbox', { name: 'Card number' }).fill('4242424242424242')
    await stripeFrame.getByRole('textbox', { name: 'Expiration date' }).fill('12/34')
    await stripeFrame.getByRole('textbox', { name: 'Security code' }).fill('123')
    await page.getByRole('button', { name: 'Submit Payment' }).click()

    // Successful cards land on an intermediate confirmation page before actually charging
    await expect(page).toHaveURL('http://localhost:3001/Submission/ConfirmPayment')
    await expect(page.getByRole('cell', { name: 'Total' })).toBeVisible()
    await page.getByRole('button', { name: 'Confirm' }).click()

    await expect(page).toHaveURL(/\/Submission\/result\?.*redirect_status=succeeded/)
    await expect(page.getByText(/WMF-\d+-\d+/)).toBeVisible()
  })

  test('Declined card shows an error and leaves the registration retryable', async ({ page }) => {
    await signIn(page, email, password)
    await buildSoloRegistrationToSubmission(page, 'Declined')

    await page.getByRole('button', { name: 'Credit Card' }).click()

    const stripeFrame = page.locator('iframe[name^="__privateStripeFrame"]').first().contentFrame()
    await stripeFrame.getByRole('textbox', { name: 'Card number' }).fill('4000000000000002')
    await stripeFrame.getByRole('textbox', { name: 'Expiration date' }).fill('12/34')
    await stripeFrame.getByRole('textbox', { name: 'Security code' }).fill('123')
    await page.getByRole('button', { name: 'Submit Payment' }).click()

    // Decline cards reach the same intermediate confirmation page as successful ones;
    // Stripe only reports the decline once "Confirm" actually attempts the charge.
    await expect(page).toHaveURL('http://localhost:3001/Submission/ConfirmPayment')
    await page.getByRole('button', { name: 'Confirm' }).click()

    // On decline, the app redirects to Registrations and shows an error toast rather than
    // staying on the payment page — the registration remains Incomplete so it can be retried.
    await expect(page).toHaveURL('http://localhost:3001/Registrations')
    await expect(page.getByText('Your card has been declined.')).toBeVisible()
  })
})
