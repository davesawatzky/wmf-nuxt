// spec: specs/e2e-comprehensive-test-plan.md
// seed: tests/e2e/seed.spec.ts

import { test, expect } from '@playwright/test'

test.describe('Submission & Confirmation', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  async function signIn(page: import('@playwright/test').Page, userEmail: string, userPassword: string) {
    await page.goto('http://localhost:3001/login')
    await page.getByText('Sign In').first().waitFor({ state: 'visible' })
    await page.getByRole('textbox', { name: 'Email' }).fill(userEmail)
    await page.getByRole('textbox', { name: 'Password' }).fill(userPassword)
    await page.getByRole('button', { name: 'Sign In' }).click()
  }

  test('Confirmation checkboxes gate the Proceed to Payment button', async ({ page }) => {
    await signIn(page, email, password)

    // Open an existing, fully valid Group registration and advance to Summary
    await page.locator('tr').filter({ hasText: 'E2E List Test Group' }).getByRole('button').first().click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // Navigate to the Submission page
    await page.getByRole('button', { name: 'Prepare to Submit' }).click()
    await expect(page).toHaveURL('http://localhost:3001/Submission')

    const proceedButton = page.getByRole('button', { name: 'Proceed to Payment' })
    await expect(proceedButton).toBeDisabled()

    // Check some but not all confirmation checkboxes
    await page.locator('#important-notes').nth(1).click()
    await page.locator('#nonrefundable').nth(1).click()
    await expect(proceedButton).toBeDisabled()

    // Check the remaining confirmation checkbox
    await page.locator('#rules-and-trophy-forms').nth(1).click()
    await expect(proceedButton).toBeEnabled()
  })

  test('Cancel on Submission returns to Registrations without submitting', async ({ page }) => {
    await signIn(page, email, password)

    await page.locator('tr').filter({ hasText: 'E2E List Test Group' }).getByRole('button').first().click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await page.getByRole('button', { name: 'Prepare to Submit' }).click()

    await page.locator('#important-notes').nth(1).click()
    await page.locator('#nonrefundable').nth(1).click()
    await page.locator('#rules-and-trophy-forms').nth(1).click()

    await page.getByRole('button', { name: 'Cancel' }).click()

    await expect(page).toHaveURL('http://localhost:3001/Registrations')
    await expect(page.locator('tr').filter({ hasText: 'E2E List Test Group' })).toContainText('Incomplete')
  })

  test('Direct navigation to Submission without a registration to confirm redirects to Registrations', async ({ page }) => {
    await signIn(page, email, password)

    await page.goto('http://localhost:3001/submission')

    await expect(page).toHaveURL('http://localhost:3001/Registrations')
  })

  test('Parent/guardian consent checkbox appears only when the Solo performer is under 18', async ({ page }) => {
    await signIn(page, email, password)

    // Create a Solo registration with a performer under 18
    await page.getByRole('img', { name: 'New Solo Registration' }).click()
    await page.getByRole('button', { name: 'I Understand' }).click()

    await page.getByRole('textbox', { name: 'First Name' }).fill('Minor')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Performer')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('15')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551111')
    await page.getByRole('textbox', { name: 'Email' }).fill('minor.performer@test.com')
    await page.locator('select[name="instrument"]').selectOption('Piano')
    await page.locator('select[name="photoPermission"]').selectOption('Yes')
    await page.getByRole('button', { name: 'Next' }).click()

    // Link an unlisted teacher
    await page.getByRole('combobox').first().click()
    await page.getByRole('combobox').first().fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()
    await page.getByRole('textbox', { name: 'First Name' }).fill('Jane')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551234')
    await page.getByRole('textbox', { name: 'Email' }).fill('jane.smith.minor@test.com')
    await page.getByRole('heading', { name: 'Teacher Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // Fill a valid Solo Class selection
    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 4')
    await page.getByLabel('Category').selectOption('OWN CHOICE')
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Sonata in C')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Mozart')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:30')
    await page.getByRole('heading', { name: 'Class Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    await page.getByRole('button', { name: 'Prepare to Submit' }).click()
    await expect(page).toHaveURL('http://localhost:3001/Submission')

    // Parent/guardian consent checkbox is visible for an under-18 performer
    await expect(page.getByText('If participant is under 18 then I certify that I am the parent/guardian of this child.')).toBeVisible()

    await page.getByRole('button', { name: 'Cancel' }).click()

    // Create a second Solo registration with an adult performer for comparison
    await page.getByRole('img', { name: 'New Solo Registration' }).click()
    await page.getByRole('button', { name: 'I Understand' }).click()

    await page.getByRole('textbox', { name: 'First Name' }).fill('Adult')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Performer')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('25')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551111')
    await page.getByRole('textbox', { name: 'Email' }).fill('adult.performer@test.com')
    await page.locator('select[name="instrument"]').selectOption('Piano')
    await page.locator('select[name="photoPermission"]').selectOption('Yes')
    await page.getByRole('button', { name: 'Next' }).click()

    await page.getByRole('combobox').first().click()
    await page.getByRole('combobox').first().fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()
    await page.getByRole('textbox', { name: 'First Name' }).fill('Jane')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551234')
    await page.getByRole('textbox', { name: 'Email' }).fill('jane.smith.adult@test.com')
    await page.getByRole('heading', { name: 'Teacher Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 4')
    await page.getByLabel('Category').selectOption('OWN CHOICE')
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Sonata in C')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Mozart')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:30')
    await page.getByRole('heading', { name: 'Class Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    await page.getByRole('button', { name: 'Prepare to Submit' }).click()
    await expect(page).toHaveURL('http://localhost:3001/Submission')

    // Parent/guardian consent checkbox is NOT shown for an adult performer
    await expect(page.getByText('If participant is under 18 then I certify that I am the parent/guardian of this child.')).not.toBeVisible()

    await page.getByRole('button', { name: 'Cancel' }).click()
  })
})
