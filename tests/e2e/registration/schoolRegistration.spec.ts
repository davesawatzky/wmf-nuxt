// spec: specs/e2e-comprehensive-test-plan.md
// section: School Registration Flow

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('School Registration Flow', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)
    await pm.loginPage.goto()
    await pm.loginPage.signIn(email, password)

    // Create a new School registration
    await page.locator('div').filter({ hasText: /^School$/ }).first().click()
    await expect(page.getByRole('heading', { name: 'School Information' })).toBeVisible()
  })

  test('Complete school registration with multiple school groups', async ({ page }) => {
    // Fill required School Information tab fields
    await page.getByRole('textbox', { name: 'School Name' }).fill('Riverbend Elementary')
    await page.getByRole('textbox', { name: 'School Division' }).fill('Winnipeg School Division')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('400 River Ave')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R3T 2N2')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045559876')

    // Advance to Teacher tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    // Select/confirm a teacher (Unlisted) on the Teacher tab
    const teacherCombobox = page.getByRole('combobox')
    await teacherCombobox.click()
    await teacherCombobox.fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()

    // Enter contact info for the unlisted teacher
    await page.getByRole('textbox', { name: 'First Name' }).fill('Mark')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Taylor')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045557890')
    await page.getByRole('textbox', { name: 'Email' }).fill('mark.taylor@test.com')

    // Blur the email field to trigger validation
    await page.getByRole('heading', { name: 'Teacher Information' }).click()

    // Advance to Groups tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'School Group Information' })).toBeVisible()

    // Fill required fields for School Group #1
    await page.getByRole('textbox', { name: 'Group Name' }).fill('Grade 4 Choir')
    await page.getByRole('textbox', { name: 'Earliest time your group can' }).fill('09:00')
    await page.getByRole('textbox', { name: 'Latest time your group can' }).fill('14:00')
    await page.getByRole('spinbutton', { name: 'Number of performers' }).fill('20')
    await page.getByRole('spinbutton', { name: 'Number of chaperones' }).fill('2')
    await page.getByRole('spinbutton', { name: 'Number of wheelchairs' }).fill('0')
    await page.getByRole('combobox').first().selectOption('Yes')

    // Add a second School Group as required by the test plan
    await page.getByRole('button', { name: 'Add Another School Group' }).click()

    // Fill required fields for School Group #2
    const groupNameFields = page.getByRole('textbox', { name: 'Group Name' })
    await groupNameFields.nth(1).fill('Grade 5 Band')
    const earliestTimeFields = page.getByRole('textbox', { name: 'Earliest time your group can' })
    await earliestTimeFields.nth(1).fill('10:00')
    const latestTimeFields = page.getByRole('textbox', { name: 'Latest time your group can' })
    await latestTimeFields.nth(1).fill('15:00')
    const numberOfPerformersFields = page.getByRole('spinbutton', { name: 'Number of performers' })
    await numberOfPerformersFields.nth(1).fill('15')
    const numberOfChaperonesFields = page.getByRole('spinbutton', { name: 'Number of chaperones' })
    await numberOfChaperonesFields.nth(1).fill('1')
    const numberOfWheelchairsFields = page.getByRole('spinbutton', { name: 'Number of wheelchairs' })
    await numberOfWheelchairsFields.nth(1).fill('0')
    await page.locator('#photo-permission').nth(3).selectOption('Yes')

    // Advance to School Classes tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Class Information' })).toBeVisible()

    // Assign Class 1 to the first school group
    await page.getByLabel('Select a School Group').selectOption('Grade 4 Choir')
    await page.locator('select[name="discipline"]').selectOption('CHORAL')
    await page.getByLabel('Subdiscipline').selectOption('SCHOOL CHOIR')
    await page.getByLabel('Grade/Level').selectOption('GRADES 4-6')
    await page.getByLabel('Category').selectOption('OWN CHOICE')

    // Complete both required selections for the choir class
    const titleFields = page.getByRole('textbox', { name: 'Title (including Opus number' })
    const composerFields = page.getByRole('textbox', { name: 'Composer' })
    const durationFields = page.getByRole('textbox', { name: 'Duration' })
    await titleFields.nth(0).fill('O Canada')
    await composerFields.nth(0).fill('Calixa Lavallee')
    await durationFields.nth(0).fill('02:30')
    await titleFields.nth(1).fill('This Land Is Your Land')
    await composerFields.nth(1).fill('Woody Guthrie')
    await durationFields.nth(1).fill('03:00')

    // Add a class for the second school group
    await page.getByRole('button', { name: 'Add Another Class' }).click()
    await page.getByLabel('Select a School Group').nth(1).selectOption('Grade 5 Band')
    await page.locator('select[name="discipline"]').nth(1).selectOption('GUITAR')
    await page.getByLabel('Subdiscipline').nth(1).selectOption('SCHOOL GUITAR GROUP')
    await page.getByLabel('Grade/Level').nth(1).selectOption('GRADES 4-6')
    await page.getByLabel('Category').nth(1).selectOption('OWN CHOICE')

    // Complete both required selections for the guitar class
    await titleFields.nth(2).fill('Romanza')
    await composerFields.nth(2).fill('Anonymous')
    await durationFields.nth(2).fill('02:00')
    await titleFields.nth(3).fill('Malaguena')
    await composerFields.nth(3).fill('Lecuona')
    await durationFields.nth(3).fill('02:45')

    // Advance to Summary tab
    await page.getByRole('button', { name: 'Next' }).click()

    // Verify the Summary tab lists school info, both groups, teacher, and selected classes
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Riverbend Elementary' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Mark Taylor' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Group 1: Grade 4 Choir' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Group 2: Grade 5 Band' })).toBeVisible()
    await expect(page.getByText('Class: SCHOOL CHOIR')).toBeVisible()
    await expect(page.getByText('Class: SCHOOL GUITAR GROUP')).toBeVisible()
    await expect(page.getByText('O Canada')).toBeVisible()
    await expect(page.getByText('Romanza')).toBeVisible()
  })

  test('Validation errors for school info and teacher fields', async ({ page }) => {
    // Attempt to advance from School info tab without required fields
    const schoolNameField = page.getByRole('textbox', { name: 'School Name' })
    const schoolDivisionField = page.getByRole('textbox', { name: 'School Division' })
    const mailingAddressField = page.getByRole('textbox', { name: 'Mailing Address' })
    const postalCodeField = page.getByRole('textbox', { name: 'Postal Code' })
    const phoneNumberField = page.getByRole('textbox', { name: 'Phone Number' })

    await expect(schoolNameField).toHaveAttribute('aria-invalid', 'true')
    await expect(schoolDivisionField).toHaveAttribute('aria-invalid', 'true')
    await expect(mailingAddressField).toHaveAttribute('aria-invalid', 'true')
    await expect(postalCodeField).toHaveAttribute('aria-invalid', 'true')
    await expect(phoneNumberField).toHaveAttribute('aria-invalid', 'true')
    await expect(page.getByText('Required').first()).toBeVisible()

    // Advance to Teacher tab (validation errors do not block navigation)
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    // Navigate back to School Information tab and verify the errors persist
    await page.getByRole('button', { name: 'Previous' }).click()
    await expect(page.getByRole('heading', { name: 'School Information' })).toBeVisible()
    await expect(schoolNameField).toHaveAttribute('aria-invalid', 'true')
    await expect(schoolDivisionField).toHaveAttribute('aria-invalid', 'true')
    await expect(mailingAddressField).toHaveAttribute('aria-invalid', 'true')
    await expect(postalCodeField).toHaveAttribute('aria-invalid', 'true')
    await expect(phoneNumberField).toHaveAttribute('aria-invalid', 'true')
  })
})
