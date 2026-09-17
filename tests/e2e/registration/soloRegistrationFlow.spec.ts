// spec: specs/e2e-comprehensive-test-plan.md
// section: Solo Registration Flow

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Solo Registration Flow', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)
    await pm.loginPage.goto()
    await pm.loginPage.signIn(email, password)

    // Create a new Solo registration
    await page.locator('div').filter({ hasText: /^Solo$/ }).first().click()

    // Dismiss the informational dialog shown when entering the form
    const understandButton = page.getByRole('button', { name: 'I Understand' })
    if (await understandButton.isVisible().catch(() => false))
      await understandButton.click()
  })

  test('Complete solo registration happy path', async ({ page }) => {
    // Fill required performer info on the Performer tab
    await page.getByRole('textbox', { name: 'First Name' }).fill('Solo')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Performer')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('15')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2049998888')
    await page.getByRole('textbox', { name: 'Email' }).fill('solo.performer@test.com')
    await page.locator('select[name="instrument"]').selectOption('Piano')
    await page.locator('select[name="photoPermission"]').selectOption('Yes')

    // Advance to Teacher tab after filling the Performer tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    // Select/confirm a private teacher on the Teacher tab
    const teacherCombobox = page.getByRole('combobox')
    await teacherCombobox.click()
    await teacherCombobox.fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()

    // Enter contact info for the unlisted teacher
    await page.getByRole('textbox', { name: 'First Name' }).fill('Jane')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551234')
    await page.getByRole('textbox', { name: 'Email' }).fill('jane.smith@test.com')

    // Blur the email field to trigger validation
    await page.getByRole('heading', { name: 'Teacher Information' }).click()

    // Advance to Solo Classes tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Class Information' })).toBeVisible()

    // Add at least one class on the Solo Classes tab
    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 4')
    await page.getByLabel('Category').selectOption('OWN CHOICE')

    // Complete required selection details for the class
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Sonata in C')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Mozart')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:30')

    // Blur the duration field to trigger validation
    await page.getByRole('heading', { name: 'Class Information' }).click()

    // Advance to Summary tab
    await page.getByRole('button', { name: 'Next' }).click()

    // Verify the Summary tab shows the performer, teacher, and selected class details
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Solo Performer' })).toBeVisible()
    await expect(page.getByText('Email: solo.performer@test.com')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Jane Smith' })).toBeVisible()
    await expect(page.getByText('Email: jane.smith@test.com')).toBeVisible()
    await expect(page.getByText('Class: PIANO SOLO')).toBeVisible()
    await expect(page.getByText('Sonata in C')).toBeVisible()
    await expect(page.getByText('Mozart')).toBeVisible()
  })

  test('Validation errors for missing required performer fields', async ({ page }) => {
    // Attempt to advance from the Performer tab without filling required fields
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    // Navigate back to Performer tab to verify empty required fields show inline validation errors
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()
    await expect(page.getByText('Required').first()).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveAttribute('aria-invalid', 'true')
  })

  test('Navigate back and forward between steps preserves data', async ({ page }) => {
    // Fill required performer info on the Performer tab
    await page.getByRole('textbox', { name: 'First Name' }).fill('Solo')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Performer')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('15')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2049998888')
    await page.getByRole('textbox', { name: 'Email' }).fill('solo.performer@test.com')
    await page.locator('select[name="instrument"]').selectOption('Piano')
    await page.locator('select[name="photoPermission"]').selectOption('Yes')

    // Advance to Teacher tab after filling the Performer tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    // Navigate back through the steps to verify data is preserved
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('Solo')
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Performer')
    await expect(page.getByRole('spinbutton', { name: 'Age' })).toHaveValue('15')
    await expect(page.getByRole('textbox', { name: 'Mailing Address' })).toHaveValue('123 Test St')
    await expect(page.getByRole('textbox', { name: 'Postal Code' })).toHaveValue('R2M 2Y7')
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('solo.performer@test.com')
  })

  test('Autosave restores in-progress solo registration after reload', async ({ page }) => {
    // Fill required performer info on the Performer tab
    await page.getByRole('textbox', { name: 'First Name' }).fill('Solo')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Performer')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('15')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2049998888')
    await page.getByRole('textbox', { name: 'Email' }).fill('solo.performer@test.com')

    // Reload the page to verify autosave restores the in-progress registration
    await page.goto('/form')

    // Dismiss the informational dialog
    const understandButton = page.getByRole('button', { name: 'I Understand' })
    if (await understandButton.isVisible().catch(() => false))
      await understandButton.click()

    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('Solo')
    await expect(page.getByRole('textbox', { name: 'Last Name' })).toHaveValue('Performer')
    await expect(page.getByRole('spinbutton', { name: 'Age' })).toHaveValue('15')
    await expect(page.getByRole('textbox', { name: 'Mailing Address' })).toHaveValue('123 Test St')
    await expect(page.getByRole('textbox', { name: 'Postal Code' })).toHaveValue('R2M 2Y7')
    await expect(page.getByRole('textbox', { name: 'Email' })).toHaveValue('solo.performer@test.com')
  })
})
