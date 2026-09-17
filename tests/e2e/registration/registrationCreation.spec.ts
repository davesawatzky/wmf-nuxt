// spec: specs/e2e-comprehensive-test-plan.md
// section: Registration Creation & Performer Type Selection

import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'
import { AuthHelper } from '../../helpers/authHelper'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Registration Creation & Performer Type Selection', () => {
  let pm: PageManager
  const password = 'Test123!@#'
  let email: string

  // Performer type cards are plain clickable divs (BaseCard), not roles/links.
  function performerCard(page: Page, label: 'Solo' | 'Group' | 'School' | 'Community') {
    return page.locator('div').filter({ hasText: new RegExp(`^${label}$`) }).first()
  }

  test.beforeAll(async ({ browser }) => {
    // Register and verify one regular user via the UI + MailHog, reused by every test below.
    const context = await browser.newContext()
    const page = await context.newPage()
    const setupPm = new PageManager(page)
    email = `e2e.regcreate.${Date.now()}@test.com`

    await setupPm.loginPage.goto()
    await setupPm.loginPage.registerRegularUser('RegCreate', 'Tester', email, password)
    await expect(
      page.locator('.Vue-Toastification__toast--success'),
    ).toContainText(/check email/i, { timeout: 5000 })

    const emailReceived = await AuthHelper.waitForEmailInMailHog(
      email,
      'WMF account verification',
      30000,
    )
    expect(emailReceived).toBe(true)

    const token = await AuthHelper.getVerificationTokenFromMailHog(email)
    expect(token).not.toBeNull()

    await setupPm.emailConfirmationPage.gotoWithToken(token!)
    await setupPm.emailConfirmationPage.verifySuccessMessage()
    await context.close()
  })

  test.beforeEach(async ({ page }) => {
    pm = new PageManager(page)
    await AuthHelper.signIn(page, email, password)
  })

  test('Create a new Solo registration', async ({ page }) => {
    await performerCard(page, 'Solo').click()

    // Verify navigation to /Form with the Performer tab active
    await page.waitForURL('**/form', { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()
    await expect(page.getByText('Performer', { exact: true })).toBeVisible()

    // Dismiss the informational dialog shown when entering the form
    const understandButton = page.getByRole('button', { name: 'I Understand' })
    if (await understandButton.isVisible().catch(() => false))
      await understandButton.click()

    // Reload /Registrations and verify the new draft registration appears in the list
    await page.goto('/registrations')
    const soloRow = page.locator('table tbody tr').filter({ hasText: 'SOLO' })
    await expect(soloRow.first()).toBeVisible()
    await expect(soloRow.first().getByText('Incomplete')).toBeVisible()
  })

  test('Create a new Group registration', async ({ page }) => {
    await performerCard(page, 'Group').click()

    // Verify navigation to /Form with the Group tab active
    await page.waitForURL('**/form', { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Group Information' })).toBeVisible()
    await expect(page.getByText('Group', { exact: true }).first()).toBeVisible()
  })

  test('Create a new School registration', async ({ page }) => {
    await performerCard(page, 'School').click()

    // Verify navigation to /Form with the School tab active
    await page.waitForURL('**/form', { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'School Information' })).toBeVisible()
    await expect(page.getByText('School', { exact: true }).first()).toBeVisible()
  })

  test('Create a new Community registration', async ({ page }) => {
    await performerCard(page, 'Community').click()

    // Verify navigation to /Form with the Community tab active
    await page.waitForURL('**/form', { timeout: 15000 })
    await expect(page.getByRole('heading', { name: 'Community Information' })).toBeVisible()
    await expect(page.getByText('Community', { exact: true }).first()).toBeVisible()
  })

  test('Navigating to /Form without an active registration redirects home', async ({ page }) => {
    // A fresh sign-in (from beforeEach) has no registration loaded into the store yet.
    await page.goto('/Form')
    await page.waitForURL('**/registrations', { timeout: 15000 })
    await expect(page).toHaveURL(/\/registrations/)
  })
})
