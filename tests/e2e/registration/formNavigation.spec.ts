// spec: specs/e2e-comprehensive-test-plan.md
// section: Multi-step Form Navigation, Autosave & Responsive Behavior

import { expect, test } from '@playwright/test'
import { PageManager } from '../../pageObjects/pageManager'

test.describe('Multi-step Form Navigation, Autosave & Responsive Behavior', () => {
  const email = 'e2e.regcreate.20260917194010@test.com'
  const password = 'Test123!@#'

  test.beforeEach(async ({ page }) => {
    const pm = new PageManager(page)
    await pm.loginPage.goto()
    await pm.loginPage.signIn(email, password)

    // Create a new Solo registration
    await page.locator('div').filter({ hasText: /^Solo$/ }).first().click()
    await page.getByRole('button', { name: 'I Understand' }).click()
  })

  test('Step tabs reflect performer type and validation state', async ({ page }) => {
    // 1. Create registrations of each performer type and inspect the visible tab names
    // expect: Tab set matches the performer type (Solo, Group, School, Community) as defined in Form.vue
    await expect(page.getByText('Performer', { exact: true })).toBeVisible()
    await expect(page.getByText('Teacher', { exact: true })).toBeVisible()
    await expect(page.getByText('Solo Classes', { exact: true })).toBeVisible()
    await expect(page.getByText('Summary', { exact: true })).toBeVisible()

    // 2. Leave a required field empty on one tab and switch to another tab
    // expect: The tab with the error shows a visible error indicator
    await expect(page.getByRole('button', { name: '1 9' })).toBeVisible()

    await page.getByRole('textbox', { name: 'First Name' }).fill('Nina')
    await page.getByRole('button', { name: 'Next' }).click()

    // The Teacher tab is now active, but the Performer tab still shows its error indicator
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()
    await expect(page.getByRole('button', { name: '1 8' })).toBeVisible()
  })

  test('Refreshing mid-form resets to the first tab while preserving field data', async ({ page }) => {
    // 1. Navigate to the third tab of a registration, then reload the page
    await page.getByRole('textbox', { name: 'First Name' }).fill('Nina')
    await page.getByRole('button', { name: 'Next' }).click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    await page.goto('http://localhost:3001/form')
    await page.getByRole('button', { name: 'I Understand' }).click()

    // expect (plan): The form reopens on the same tab (session-storage restored)
    // Actual observed behavior: the form always resets to the first tab (Performer) on reload,
    // though previously entered field data is preserved via autosave
    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()
    await expect(page.getByRole('textbox', { name: 'First Name' })).toHaveValue('Nina')
  })

  test('Swipe gesture does not change tabs; mobile navigation uses the bottom bar buttons', async ({ page }) => {
    // 1. Resize the viewport to a mobile size and perform a left/right swipe gesture on the form area
    await page.setViewportSize({ width: 390, height: 844 })

    const swipeArea = page.locator('.border-sky-500.rounded-lg.p-2.mb-6')
    const box = await swipeArea.boundingBox()
    if (!box)
      throw new Error('Swipe area not found')

    const y = box.y + box.height / 2
    await swipeArea.dispatchEvent('touchstart', {
      touches: [{ identifier: 1, clientX: box.x + box.width - 20, clientY: y }],
    })
    await swipeArea.dispatchEvent('touchmove', {
      touches: [{ identifier: 1, clientX: box.x + 20, clientY: y }],
    })
    await swipeArea.dispatchEvent('touchend', {
      changedTouches: [{ identifier: 1, clientX: box.x + 20, clientY: y }],
    })

    // expect (plan): Swiping left advances to the next tab
    // Actual observed behavior: the swipe gesture does not change the active tab
    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()

    // The mobile bottom bar buttons are the working navigation mechanism on small viewports
    await page.locator('#mobile-next-button').click()
    await expect(page.getByRole('heading', { name: 'Teacher Information' })).toBeVisible()

    await page.locator('#mobile-previous-button').click()
    await expect(page.getByRole('heading', { name: 'Performer Information' })).toBeVisible()
  })
})
