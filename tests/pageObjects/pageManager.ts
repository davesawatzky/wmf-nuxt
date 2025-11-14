import type { Page } from '@playwright/test'
import { LoginPage } from './loginPage'
import { EmailConfirmationPage } from './emailConfirmationPage'
import { PasswordResetPage } from './passwordResetPage'
import { RegistrationsPage } from './registrationsPage'

/**
 * Centralized Page Object Manager
 * Provides easy access to all page objects from a single instance
 *
 * Usage in tests:
 * const pm = new PageManager(page)
 * await pm.loginPage.goto()
 * await pm.loginPage.signIn(email, password)
 */
export class PageManager {
  readonly page: Page
  readonly loginPage: LoginPage
  readonly emailConfirmationPage: EmailConfirmationPage
  readonly passwordResetPage: PasswordResetPage
  readonly registrationsPage: RegistrationsPage

  constructor(page: Page) {
    this.page = page
    this.loginPage = new LoginPage(page)
    this.emailConfirmationPage = new EmailConfirmationPage(page)
    this.passwordResetPage = new PasswordResetPage(page)
    this.registrationsPage = new RegistrationsPage(page)
  }
}
