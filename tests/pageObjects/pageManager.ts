import type { Page } from '@playwright/test'
import { AuthPage } from './authPage'

export class PageManager {
  private readonly page: Page
  private readonly authPage: AuthPage

  constructor(page: Page) {
    this.page = page
    this.authPage = new AuthPage(this.page)
  }

  getAuthPage() {
    return this.authPage
  }
}
