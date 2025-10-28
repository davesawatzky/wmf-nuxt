import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface TestAccount {
  email: string
  password: string
  role: string
  privateTeacher: boolean
  schoolTeacher: boolean
  firstName: string
  lastName: string
}

test.describe.serial('Seed Test Accounts', () => {
  let accounts: TestAccount[]

  test.beforeAll(() => {
    // Load test accounts
    const accountsFilePath = path.resolve(
      __dirname,
      '../../playwright/.auth/test-accounts.json'
    )
    const accountsData = fs.readFileSync(accountsFilePath, 'utf-8')
    accounts = JSON.parse(accountsData)
  })

  for (let i = 0; i < 5; i++) {
    test(`Create account ${i + 1}`, async ({ page }) => {
      const account = accounts[i]

      await page.goto('/login')

      // Click sign up link
      await page.getByRole('button', { name: 'Sign up here.' }).click()

      // Wait for registration form
      await page.waitForTimeout(500)

      // Fill in registration form
      await page.getByLabel('First Name').fill(account.firstName)
      await page.getByLabel('Last Name').fill(account.lastName)

      // Check teacher checkboxes if applicable
      if (account.privateTeacher) {
        await page.getByRole('checkbox', { name: 'Private Teacher' }).check()
        // Select a default instrument
        await page.getByLabel('Instrument(s)').selectOption('Piano')
      }

      if (account.schoolTeacher) {
        await page.getByRole('checkbox', { name: 'School Teacher' }).check()
      }

      // Fill email and password
      await page.getByLabel('Email').fill(account.email)
      await page.getByLabel('Password').first().fill(account.password)
      await page
        .getByLabel('Re-enter Password', { exact: true })
        .fill(account.password)

      // Submit registration
      await page.getByRole('button', { name: 'Register New Account' }).click()

      // Wait for success message or redirect
      try {
        await expect(
          page.getByText('Check Email for account verification link')
        ).toBeVisible({ timeout: 10000 })

        console.log(`✓ Account created: ${account.email}`)
      } catch (error) {
        // Account might already exist
        const errorMsg = await page
          .getByText('already exists')
          .textContent()
          .catch(() => null)
        if (errorMsg) {
          console.log(`⚠ Account already exists: ${account.email}`)
        } else {
          throw error
        }
      }
    })
  }
})
