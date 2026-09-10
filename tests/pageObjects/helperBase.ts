import type { Page } from '@playwright/test'

/**
 * Base class for all page objects
 * Provides common utilities and page reference
 */
export class HelperBase {
  readonly page: Page

  constructor(page: Page) {
    this.page = page
  }

  /**
   * Wait for a specific amount of time
   */
  async wait(ms: number) {
    await this.page.waitForTimeout(ms)
  }

  /**
   * Navigate to a URL
   */
  async navigate(path: string) {
    await this.page.goto(path)
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Get current URL
   */
  getCurrentUrl(): string {
    return this.page.url()
  }

  /**
   * Check if element exists on page
   */
  async elementExists(selector: string): Promise<boolean> {
    return (await this.page.locator(selector).count()) > 0
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation() {
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Reload the current page
   */
  async reload() {
    await this.page.reload()
    await this.page.waitForLoadState('networkidle')
  }

  /**
   * Take a screenshot
   */
  async takeScreenshot(name: string) {
    await this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    })
  }
}
