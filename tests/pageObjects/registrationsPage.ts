import { expect } from '@playwright/test'
import { HelperBase } from './helperBase'

/**
 * Page Object Model for Registrations page
 * Main landing page after successful authentication
 */
export class RegistrationsPage extends HelperBase {
  // Locators
  private readonly heading = () => this.page.locator('h1')
  private readonly newRegistrationButton = () =>
    this.page.getByRole('button', { name: /new registration/i })
  private readonly registrationsList = () =>
    this.page.locator('[data-testid="registrations-list"]')
  private readonly userMenu = () =>
    this.page.locator('[data-testid="user-menu"]')
  private readonly logoutButton = () =>
    this.page.getByRole('button', { name: /logout/i })

  /**
   * Navigate to registrations page
   */
  async goto() {
    await this.page.goto('/registrations')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Verify user is on registrations page
   */
  async verifyOnRegistrationsPage() {
    await expect(this.page).toHaveURL(/\/registrations/)
    await expect(this.heading()).toContainText(/registrations/i)
  }

  /**
   * Verify page is accessible (user is authenticated)
   */
  async verifyPageAccessible() {
    await this.verifyOnRegistrationsPage()
    await expect(this.newRegistrationButton()).toBeVisible()
  }

  /**
   * Click new registration button
   */
  async clickNewRegistration() {
    await this.newRegistrationButton().click()
  }

  /**
   * Open user menu
   */
  async openUserMenu() {
    await this.userMenu().click()
  }

  /**
   * Logout user
   */
  async logout() {
    await this.openUserMenu()
    await this.logoutButton().click()
  }

  /**
   * Verify redirect to login (user not authenticated)
   */
  async verifyRedirectToLogin() {
    await this.page.waitForURL('**/login', { timeout: 5000 })
    await expect(this.page).toHaveURL(/\/login/)
  }

  /**
   * Get registrations count
   */
  async getRegistrationsCount(): Promise<number> {
    const items = await this.registrationsList().locator('> *').count()
    return items
  }
}
