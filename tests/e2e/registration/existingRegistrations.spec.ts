// spec: specs/e2e-comprehensive-test-plan.md
// section: Managing Existing Registrations

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Managing Existing Registrations', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)
    await pm.loginPage.goto()
    await pm.loginPage.signIn(email, password)
  })

  test('Registrations list shows all registrations for the signed-in user', async ({ page }) => {
    // 1. Create two registrations of different performer types, then reload /Registrations
    // Create a new Solo registration
    await page.locator('div').filter({ hasText: /^Solo$/ }).first().click()
    await page.getByRole('button', { name: 'I Understand' }).click()

    // Set a unique registration label to identify this Solo registration later in the list
    await page.getByRole('textbox', { name: 'Registration Label' }).fill('E2E List Test Solo')
    await page.getByRole('heading', { name: 'Performer Information' }).click()

    // Navigate back to the registrations list to create a second registration of a different type
    await page.getByRole('menuitem', { name: 'Registrations' }).click()
    await page.getByRole('menuitem', { name: 'My Registrations' }).click()

    // Create a new Group registration
    await page.locator('div').filter({ hasText: /^Group$/ }).first().click()

    // Set a unique registration label to identify this Group registration later in the list
    await page.getByRole('textbox', { name: 'Registration Label' }).fill('E2E List Test Group')
    await page.getByRole('heading', { name: 'Group Information' }).click()

    // Reload the registrations list
    await page.goto('http://localhost:3001/Registrations')

    // expect: Both registrations are listed with correct labels/performer types
    const soloRow = page.locator('tr').filter({ hasText: 'E2E List Test Solo' })
    await expect(soloRow).toContainText('SOLO')

    const groupRow = page.locator('tr').filter({ hasText: 'E2E List Test Group' })
    await expect(groupRow).toContainText('GROUP')
  })

  test('Resume and edit a draft registration', async ({ page }) => {
    // Create a partially-filled Solo draft registration to resume later
    await page.locator('div').filter({ hasText: /^Solo$/ }).first().click()
    await page.getByRole('button', { name: 'I Understand' }).click()

    await page.getByRole('textbox', { name: 'Registration Label' }).fill('E2E Resume Draft Solo')
    await page.getByRole('textbox', { name: 'First Name' }).fill('Owen')
    await page.getByRole('heading', { name: 'Performer Information' }).click()

    // Navigate away without finishing, then return to the registrations list
    await page.getByRole('menuitem', { name: 'Registrations' }).click()
    await page.getByRole('menuitem', { name: 'My Registrations' }).click()

    // 1. Click an existing draft registration from the list
    const draftRow = page.locator('tr').filter({ hasText: 'E2E Resume Draft Solo' })
    await draftRow.getByRole('button').first().click()

    // expect: User is navigated to /Form with previously saved data pre-populated
    await expect(page).toHaveURL('http://localhost:3001/form')
    await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('Owen')

    // 2. Edit a field and advance through the remaining tabs
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Resumed')
    await page.getByRole('spinbutton', { name: 'Age' }).fill('15')
    await page.getByRole('textbox', { name: 'Mailing Address' }).fill('123 Test St')
    await page.getByRole('textbox', { name: 'Postal Code' }).fill('R2M 2Y7')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2049998888')
    await page.getByRole('textbox', { name: 'Email' }).fill('owen.resumed@test.com')
    await page.locator('select[name="instrument"]').selectOption('Piano')
    await page.locator('select[name="photoPermission"]').selectOption('Yes')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    // Select/confirm a teacher on the Teacher tab
    const teacherCombobox = page.getByRole('combobox')
    await teacherCombobox.click()
    await teacherCombobox.fill('Unlisted')
    await page.getByRole('option', { name: 'Unlisted Teacher' }).click()
    await page.getByRole('textbox', { name: 'First Name' }).fill('Jane')
    await page.getByRole('textbox', { name: 'Last Name' }).fill('Smith')
    await page.getByRole('textbox', { name: 'Phone Number' }).fill('2045551234')
    await page.getByRole('textbox', { name: 'Email' }).fill('jane.smith.resume@test.com')
    await page.getByRole('heading', { name: 'Teacher Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Class Information' })).toBeVisible()

    // Add at least one class on the Solo Classes tab
    await page.locator('select[name="discipline"]').selectOption('PIANO')
    await page.getByLabel('Subdiscipline').selectOption('PIANO SOLO')
    await page.getByLabel('Grade/Level').selectOption('GRADE/LEVEL 4')
    await page.getByLabel('Category').selectOption('OWN CHOICE')
    await page.getByRole('textbox', { name: 'Title (including Opus number' }).fill('Sonata in C')
    await page.getByRole('textbox', { name: 'Composer' }).fill('Mozart')
    await page.getByRole('textbox', { name: 'Duration' }).fill('03:30')
    await page.getByRole('heading', { name: 'Class Information' }).click()
    await page.getByRole('button', { name: 'Next' }).click()

    // expect: Edited value persists through Summary
    await expect(page.getByRole('heading', { name: 'Registration Summary' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Owen Resumed' })).toBeVisible()
    await expect(page.getByText('Email: owen.resumed@test.com')).toBeVisible()
  })

  test('A submitted registration is shown as read-only and cannot be reopened from the list', async ({ page }) => {
    // Registration 8641 ("E2E List Test Group") was previously submitted and paid by cash
    await page.goto('http://localhost:3001/Registrations')

    const submittedRow = page.locator('tr').filter({ hasText: 'E2E List Test Group' })
    await expect(submittedRow).toContainText('Submitted')
    await expect(submittedRow).toContainText('WMF-8641-3929')

    // expect: No view/edit action button is available for a submitted registration
    await expect(submittedRow.getByRole('button')).toHaveCount(0)
  })
})
