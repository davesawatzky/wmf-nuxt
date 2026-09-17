// spec: specs/e2e-comprehensive-test-plan.md
// section: Group Registration Flow

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Group Registration Flow', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)
    await pm.loginPage.goto()
    await pm.loginPage.signIn(email, password)

    // Create a new Group registration
    await page.locator('div').filter({ hasText: /^Group$/ }).first().click()

    // Fill required Group Information tab
    await page.getByRole('textbox', { name: 'Group Name' }).fill('Test Ensemble')
    await page.getByRole('radio', { name: 'Instrumental Group' }).click()

    // Advance to Performers tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()
  })

  test('Complete group registration happy path', async ({ page }) => {
    // Add the first performer on the Performers tab
    await page.locator('[id="7"]').fill('Alice')
    await page.locator('[id="8"]').fill('Anderson')
    await page.locator('[id="9"]').fill('16')
    await page.locator('[id="10"]').fill('100 Main St')
    await page.locator('[id="13"]').fill('R2M 2Y7')
    await page.locator('[id="14"]').fill('2045551111')
    await page.locator('[id="15"]').fill('alice.anderson@test.com')
    await page.locator('#instrument').nth(1).selectOption('Violin')
    await page.locator('#photo-permission').nth(1).selectOption('Yes')

    // Add the second performer on the Performers tab
    await page.locator('[id="21"]').fill('Ben')
    await page.locator('[id="22"]').fill('Baker')
    await page.locator('[id="23"]').fill('17')
    await page.locator('[id="24"]').fill('200 Elm St')
    await page.locator('[id="27"]').fill('R3T 5V6')
    await page.locator('[id="28"]').fill('2045552222')
    await page.locator('[id="29"]').fill('ben.baker@test.com')
    await page.locator('#instrument').nth(3).selectOption('Violin')
    await page.locator('#photo-permission').nth(3).selectOption('Yes')

    // Fill required Level field for the performer
    await page.locator('[id="18"]').fill('Grade 4')
    await page.locator('[id="32"]').fill('Grade 5')

    // Advance to Teacher tab
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    // Select/confirm a teacher (Unlisted) on the Teacher tab
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

    // Advance to Group Classes tab
    await page.getByRole('button', { name: 'Next' }).click()

    // Dismiss the duplicate teacher notification if this teacher email already exists
    const duplicateAlertClose = page.getByRole('button', { name: 'Close' })
    if (await duplicateAlertClose.isVisible().catch(() => false))
      await duplicateAlertClose.click()

    // Add at least one class on the Group Classes tab
    await page.locator('select[name="discipline"]').selectOption('STRINGS')
    await page.getByLabel('Subdiscipline').selectOption('STRING DUET')
    await page.getByLabel('Grade/Level').selectOption('GRADES/LEVELS 3-4')
    await page.getByLabel('Category').selectOption('OWN CHOICE')

    // Complete required selection details for the class
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Duo in G')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Vivaldi')
    await page.getByRole('textbox', { name: 'Duration' }).fill('04:15')

    // Blur the duration field to trigger validation
    await page.getByRole('heading', { name: 'Class Information' }).click()

    // Advance to Summary tab
    await page.getByRole('button', { name: 'Next' }).click()

    // Verify the Summary tab shows the group, performer(s), teacher, and selected class details
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Test Ensemble' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Alice Anderson' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Ben Baker' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Jane Smith' })).toBeVisible()
    await expect(page.getByText('Class: STRING DUET')).toBeVisible()
    await expect(page.getByText('Duo in G')).toBeVisible()
    await expect(page.getByText('Vivaldi')).toBeVisible()
  })

  test('Add multiple performers to a group', async ({ page }) => {
    // Add the first performer on the Performers tab
    await page.locator('[id="7"]').fill('Alice')
    await page.locator('[id="8"]').fill('Anderson')

    // Add the second performer on the Performers tab
    await page.locator('[id="21"]').fill('Ben')
    await page.locator('[id="22"]').fill('Baker')

    // Add a third performer to test adding multiple performers
    await page.getByRole('button', { name: 'Add Another Performer' }).click()

    // Add a third performer to test multiple performers
    await page.locator('[id="35"]').fill('Cara')
    await page.locator('[id="36"]').fill('Chen')

    // Verify both (and the newly added) performers appear
    await expect(page.getByRole('heading', { name: 'Performer #1' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Performer #2' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Performer #3' })).toBeVisible()
    await expect(page.locator('[id="7"]')).toHaveValue('Alice')
    await expect(page.locator('[id="21"]')).toHaveValue('Ben')
    await expect(page.locator('[id="35"]')).toHaveValue('Cara')
  })

  test('Remove a performer from the group', async ({ page }) => {
    // Add the first performer on the Performers tab
    await page.locator('[id="7"]').fill('Alice')
    await page.locator('[id="8"]').fill('Anderson')

    // Add the second performer on the Performers tab
    await page.locator('[id="21"]').fill('Ben')
    await page.locator('[id="22"]').fill('Baker')

    // Add a third performer to test adding multiple performers
    await page.getByRole('button', { name: 'Add Another Performer' }).click()

    // Add a third performer to test multiple performers
    await page.locator('[id="35"]').fill('Cara')
    await page.locator('[id="36"]').fill('Chen')

    // Remove a performer from the group to verify remaining performer list
    await page.getByRole('button', { name: 'Remove This Performer' }).nth(2).click()

    // Verify only the remaining performers are listed
    await expect(page.getByRole('heading', { name: 'Performer #1' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Performer #2' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Performer #3' })).not.toBeVisible()
    await expect(page.locator('[id="7"]')).toHaveValue('Alice')
    await expect(page.locator('[id="21"]')).toHaveValue('Ben')
  })
})
