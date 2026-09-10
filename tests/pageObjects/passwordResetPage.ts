import { expect } from '@playwright/test'
import { HelperBase } from './helperBase'

/**
 * Page Object Model for Password Reset page
 * Handles forgot password and password reset flows
 */
export class PasswordResetPage extends HelperBase {
  // Locators
  private readonly emailInput = () => this.page.locator('input[name="email"]')
  private readonly newPasswordInput = () =>
    this.page.locator('input[name="password1"]')
  private readonly confirmPasswordInput = () =>
    this.page.locator('input[name="password2"]')

  private readonly sendResetLinkButton = () =>
    this.page.getByRole('button', { name: 'Send Reset Link', exact: true })
  private readonly resetPasswordButton = () =>
    this.page.getByRole('button', { name: /reset password/i })
  private readonly backToLoginLink = () =>
    this.page.getByRole('link', { name: /back to login/i })

  private readonly heading = () => this.page.locator('h4')
  private readonly messageText = () => this.page.locator('p')

  /**
   * Navigate to forgot password page
   */
  async gotoForgotPassword() {
    await this.page.goto('/password/EmailVerification')
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Navigate to password reset page with token
   */
  async gotoPasswordResetWithToken(token: string) {
    await this.page.goto(`/password/PasswordReset?token=${token}`)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Fill in email for password reset request
   */
  async fillResetRequestEmail(email: string) {
    await this.emailInput().fill(email)
  }

  /**
   * Submit password reset request
   */
  async submitResetRequest() {
    await Promise.all([
      // Wait for GraphQL query to complete
      this.page.waitForResponse(
        (response) =>
          response.url().includes('/graphql') && response.status() === 200,
        { timeout: 5000 }
      ),
      this.sendResetLinkButton().click(),
    ])

    // Give the UI time to react to the GraphQL response and update
    await this.page.waitForTimeout(1000)
  }

  /**
   * Request password reset for email
   */
  async requestPasswordReset(email: string) {
    await this.fillResetRequestEmail(email)
    await this.submitResetRequest()
  }

  /**
   * Fill in new password fields
   */
  async fillNewPassword(password: string) {
    await this.newPasswordInput().fill(password)
    await this.confirmPasswordInput().fill(password)
  }

  /**
   * Submit new password
   */
  async submitNewPassword() {
    await this.resetPasswordButton().click()
  }

  /**
   * Reset password with token
   */
  async resetPassword(token: string, newPassword: string) {
    await this.gotoPasswordResetWithToken(token)
    await this.fillNewPassword(newPassword)
    await this.submitNewPassword()
  }

  /**
   * Verify password reset email sent message
   */
  async verifyResetEmailSent() {
    await expect(this.heading()).toContainText('Email Verification Sent')
    await expect(this.messageText()).toContainText(
      /email verification link has been sent/i
    )
  }

  /**
   * Verify password successfully reset
   */
  async verifyPasswordResetSuccess() {
    await expect(this.heading()).toContainText(/password changed/i)
  }

  /**
   * Verify invalid/expired token message
   */
  async verifyInvalidToken() {
    await expect(this.heading()).toContainText(/error/i)
  }

  /**
   * Click back to login
   */
  async clickBackToLogin() {
    await this.backToLoginLink().click()
  }

  /**
   * Click proceed to sign in button
   */
  async clickProceedToSignIn() {
    await this.page.getByRole('link', { name: /proceed to sign in/i }).click()
  }

  /**
   * Verify redirect to login page
   */
  async verifyRedirectToLogin() {
    await this.page.waitForURL('**/login', { timeout: 5000 })
    await expect(this.page).toHaveURL(/\/login/)
  }

  /**
   * Verify validation error for email field
   */
  async verifyEmailRequired() {
    await this.emailInput().blur()
    await this.page.waitForTimeout(500)
    const errorText = this.page.locator('text=/email is required/i')
    await expect(errorText).toBeVisible()
  }

  /**
   * Verify password validation error
   */
  async verifyPasswordError(errorPattern: RegExp) {
    await this.newPasswordInput().blur()
    await this.page.waitForTimeout(500)
    const errorText = this.page.locator(`text=${errorPattern}`)
    await expect(errorText).toBeVisible()
  }

  /**
   * Verify password mismatch error
   */
  async verifyPasswordMismatchError() {
    await this.confirmPasswordInput().blur()
    await this.page.waitForTimeout(500)
    const errorText = this.page.locator('text=/passwords must match/i')
    await expect(errorText).toBeVisible()
  }
}
