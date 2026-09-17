// spec: specs/e2e-comprehensive-test-plan.md
// section: Community Registration Flow

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Community Registration Flow', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)
    await pm.loginPage.goto()
    await pm.loginPage.signIn(email, password)

    // Create a new Community registration
    await page.locator('div').filter({ hasText: /^Community$/ }).first().click()
    await expect(page.getByRole('heading', { name: 'Community Information' })).toBeVisible()
  })

  test('Complete community registration with multiple community groups', async ({ page }) => {
    // Fill required Community Information fields
    await page.getByRole('textbox', { name: 'Community Name' }).fill('Riverbend Community Choir')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('500 River Ave')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R3T 3N3')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045553456')
    await page.getByRole('textbox', { name: 'Email Address' }).fill('riverbend.choir@test.com')

    // Advance to Contact tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Community Conductor Information' })).toBeVisible()

    // Select/confirm a contact/teacher (Unlisted) on the Contact tab
    const conductorCombobox = page.getByRole('combobox')
    await conductorCombobox.click()
    await conductorCombobox.fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()

    // Enter contact info for the unlisted conductor
    await page.getByRole('textbox', { name: 'First Name' }).fill('Nora')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Fields')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045556789')
    await page.getByRole('textbox', { name: 'Email' }).fill('nora.fields@test.com')

    // Blur the email field to trigger validation
    await page.getByRole('heading', { name: 'Community Conductor' }).click()

    // Advance to Groups tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Community Group Information' })).toBeVisible()

    // Fill required fields for the community group
    await page.getByRole('textbox', { name: 'Group Name' }).fill('Youth Ensemble')
    await page.getByRole('textbox', { name: 'Earliest time your group can' }).fill('09:00')
    await page.getByRole('textbox', { name: 'Latest time your group can' }).fill('14:00')
    await page.getByRole('spinbutton', { name: 'Number of performers' }).fill('12')
    await page.getByRole('spinbutton', { name: 'Number of chaperones' }).fill('1')
    await page.getByRole('spinbutton', { name: 'Number of wheelchairs' }).fill('0')
    await page.getByRole('combobox').selectOption('Yes')

    // Advance to Community Classes tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Class Information' })).toBeVisible()

    // Assign the class to the community group
    await page.getByLabel('Select a Community Group').selectOption('Youth Ensemble')
    await page.locator('select[name="discipline"]').selectOption('CHORAL')
    await page.getByLabel('Subdiscipline').selectOption('YOUTH CHOIR')
    await page.getByLabel('Grade/Level').selectOption('19 YEARS AND UNDER')
    await page.getByLabel('Category').selectOption('OWN CHOICE')

    // Complete both required selections for the choir class
    const titleFields = page.getByRole('textbox', { name: 'Title (including Opus number' })
    const composerFields = page.getByRole('textbox', { name: 'Composer' })
    const durationFields = page.getByRole('textbox', { name: 'Duration' })
    await titleFields.nth(0).fill('Ode to Joy')
    await composerFields.nth(0).fill('Beethoven')
    await durationFields.nth(0).fill('03:15')
    await titleFields.nth(1).fill('Shenandoah')
    await composerFields.nth(1).fill('Traditional')
    await durationFields.nth(1).fill('03:30')

    // Advance to Summary tab
    await page.getByRole('button', { name: 'Next' }).click()

    // Verify the Summary tab lists community info, group, contact, and selected classes
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Riverbend Community Choir' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Nora Fields' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Group 1: Youth Ensemble' })).toBeVisible()
    await expect(page.getByText('Class: YOUTH CHOIR')).toBeVisible()
    await expect(page.getByText('Ode to Joy')).toBeVisible()
    await expect(page.getByText('Shenandoah')).toBeVisible()
  })

  test('Validation errors for community info and contact fields', async ({ page }) => {
    // Attempt to advance from Community info tab without required fields
    const communityNameField = page.getByRole('textbox', { name: 'Community Name' })
    const mailingAddressField = page.getByRole('textbox', { name: 'Mailing Address' })
    const postalCodeField = page.getByRole('textbox', { name: 'Postal Code' })
    const phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' })
    const emailAddressField = page.getByRole('textbox', { name: 'Email Address' })

    await expect(communityNameField).toHaveAttribute('aria-invalid', 'true')
    await expect(mailingAddressField).toHaveAttribute('aria-invalid', 'true')
    await expect(postalCodeField).toHaveAttribute('aria-invalid', 'true')
    await expect(phoneNumberField).toHaveAttribute('aria-invalid', 'true')
    await expect(emailAddressField).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Required').first()).toBeVisible()

    // Advance to Contact tab (validation errors do not block navigation)
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Community Conductor Information' })).toBeVisible()

    // Navigate back to Community Information tab and verify the errors persist
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('heading', { name: 'Community Information' })).toBeVisible()
    await expect(communityNameField).toHaveAttribute('aria-invalid', 'true')
    await expect(mailingAddressField).toHaveAttribute('aria-invalid', 'true')
    await expect(postalCodeField).toHaveAttribute('aria-invalid', 'true')
    await expect(phoneNumberField).toHaveAttribute('aria-invalid', 'true')
    await expect(emailAddressField).toHaveAttribute('aria-invalid', 'true')
  })
})
