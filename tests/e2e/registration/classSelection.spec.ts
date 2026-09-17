// spec: specs/e2e-comprehensive-test-plan.md
// section: Festival Class Selection

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Festival Class Selection', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)
    await pm.loginPage.goto()
    await pm.loginPage.signIn(email, password)

    // Create a new Solo registration
    await page.locator('div').filter({ hasText: /^Solo$/ }).first().click()
    await page.getByRole('button', { name: 'I Understand' }).click()

    // Fill required performer fields
    await page.getByRole('textbox', { name: 'First Name' }).fill('Ella')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Evans')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('15')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('600 Oak Ave')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 3Z8')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045552468')
    await page.getByRole('textbox', { name: 'Email' }).fill('ella.evans@test.com')
    await page.locator('select[name="instrument"]').selectOption('Piano')
    await page.locator('select[name="photoPermission"]').selectOption('Yes')
    await page.getByRole('button', { name: 'Next' }).click()

    // Select Unlisted teacher on the Teacher tab
    const teacherCombobox = page.getByRole('combobox')
    await teacherCombobox.click()
    await teacherCombobox.fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()
    await page.getByRole('textbox', { name: 'First Name' }).fill('Paul')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Reed')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045553691')
    await page.getByRole('textbox', { name: 'Email' }).fill('paul.reed@test.com')
    await page.getByRole('heading', { name: 'Teacher Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // Now on the Solo Classes tab
    await expect(page.getByRole('heading', { name: 'Class Information' })).toBeVisible()
  })

  test('Search and select classes for a performer', async ({ page }) => {
    // Select discipline, subdiscipline, grade/level and category for the class
    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 5')
    await page.getByLabel('Category').selectOption('OWN CHOICE')

    // Fill required Selection 1 details
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Fur Elise')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Beethoven')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:00')

    // Advance to Summary and verify the class is added with correct fee and class number
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByText('2265')).toBeVisible()
    await expect(page.getByText('$30.00')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Festival Class Number: 2265' })).toBeVisible()
  })

  test('Remove a selected class', async ({ page }) => {
    // Select and complete a class
    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 5')
    await page.getByLabel('Category').selectOption('OWN CHOICE')
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Fur Elise')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Beethoven')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:00')

    // Add a second class then remove it
    await page.getByRole('button', { name: 'Add Another Class' }).click()
    await page.getByRole('button', { name: 'Remove This Class' }).nth(1).click()

    // Advance to Summary and verify only the first class remains with the correct total
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByText('$30.00', { exact: true })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Festival Class Number: 2265' })).toHaveCount(1)
  })

  test('At least one class required to proceed to Summary', async ({ page }) => {
    // Attempt to advance to Summary without selecting any class
    await page.getByRole('button', { name: 'Next' }).click()

    // Summary indicates an incomplete registration and blocks submission
    await expect(page.getByRole('heading', { name: 'Incomplete registration form' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Prepare to Submit' })).toBeDisabled()
  })

  test('Duplicate class selection is not blocked by the form', async ({ page }) => {
    // Select and complete a class
    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 5')
    await page.getByLabel('Category').selectOption('OWN CHOICE')
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Fur Elise')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Beethoven')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:00')

    // Add a second class with the identical discipline/subdiscipline/grade/category/selection
    await page.getByRole('button', { name: 'Add Another Class' }).click()
    const disciplineFields = page.locator('#disciplines')
    await disciplineFields.nth(1).selectOption('PIANO')
    const subdisciplineFields = page.getByLabel('Subdiscipline')
    await subdisciplineFields.nth(1).selectOption('PIANO SOLO')
    const gradeLevelFields = page.getByLabel('Grade/Level')
    await gradeLevelFields.nth(1).selectOption('GRADE/LEVEL 5')
    const categoryFields = page.getByLabel('Category')
    await categoryFields.nth(1).selectOption('OWN CHOICE')
    const titleFields = page.getByRole('textbox', { name: 'Title (including Opus number' })
    const composerFields = page.getByRole('textbox', { name: 'Composer' })
    const durationFields = page.getByRole('textbox', { name: 'Duration' })
    await titleFields.nth(1).fill('Fur Elise')
    await composerFields.nth(1).fill('Beethoven')
    await durationFields.nth(1).fill('03:00')

    // Advance to Summary: the duplicate class is currently accepted (not blocked) by the form,
    // resulting in two identical class entries and a doubled total fee.
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Festival Class Number: 2265' })).toHaveCount(2)
    await expect(page.getByText('$60.00')).toBeVisible()
  })
})
