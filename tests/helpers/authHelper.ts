/* eslint-disable @typescript-eslint/no-extraneous-class */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Page } from '@playwright/test'
import { expect } from '@playwright/test'

/**
 * Test User Data Interface
 */
export interface TestUser {
  email: string
  password: string
  firstName: string
  lastName: string
  accountType:
    | 'regular'
    | 'private_teacher'
    | 'school_teacher'
    | 'both_teachers'
    | 'admin'
  instrument?: string
  isActive: boolean
  emailConfirmed: boolean
}

/**
 * Pre-defined test users from authentication-test-plan.md
 */
export const TEST_USERS: Record<string, TestUser> = {
  REGULAR_USER: {
    email: 'test.user@wmf.test',
    password: 'Test123!@#',
    firstName: 'Test',
    lastName: 'User',
    accountType: 'regular',
    isActive: true,
    emailConfirmed: true,
  },
  PRIVATE_TEACHER: {
    email: 'private.teacher@wmf.test',
    password: 'Teacher456!@#',
    firstName: 'Private',
    lastName: 'Teacher',
    accountType: 'private_teacher',
    instrument: 'Piano',
    isActive: false, // Requires admin approval
    emailConfirmed: true,
  },
  SCHOOL_TEACHER: {
    email: 'school.teacher@wmf.test',
    password: 'School789!@#',
    firstName: 'School',
    lastName: 'Teacher',
    accountType: 'school_teacher',
    isActive: true,
    emailConfirmed: true,
  },
  BOTH_TEACHERS: {
    email: 'both.teacher@wmf.test',
    password: 'Both000!@#',
    firstName: 'Both',
    lastName: 'Teacher',
    accountType: 'both_teachers',
    instrument: 'Violin',
    isActive: false, // Requires admin approval
    emailConfirmed: true,
  },
  ADMIN: {
    email: 'admin@wmf.test',
    password: 'Admin999!@#',
    firstName: 'Admin',
    lastName: 'User',
    accountType: 'admin',
    isActive: true,
    emailConfirmed: true,
  },
}

/**
 * Authentication helper utilities
 */
export class AuthHelper {
  /**
   * Sign in user via UI
   */
  static async signIn(
    page: Page,
    email: string,
    password: string
  ): Promise<void> {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    await page.locator('input[name="email"]').fill(email)
    await page.locator('input[name="password"]').fill(password)
    await page.getByRole('button', { name: /sign in/i }).click()

    // Wait for navigation
    await page.waitForURL('**/registrations', { timeout: 10000 })
  }

  /**
   * Sign in using test user preset
   */
  static async signInAsUser(
    page: Page,
    userKey: keyof typeof TEST_USERS
  ): Promise<void> {
    const user = TEST_USERS[userKey]
    await this.signIn(page, user.email, user.password)
  }

  /**
   * Register new user account via UI
   */
  static async registerUser(
    page: Page,
    user: {
      firstName: string
      lastName: string
      email: string
      password: string
      privateTeacher?: boolean
      schoolTeacher?: boolean
      instrument?: string
    }
  ): Promise<void> {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')

    // Switch to sign up form
    await page.getByRole('button', { name: /sign up here/i }).click()
    await page.waitForTimeout(300)

    // Fill form
    if (user.privateTeacher) {
      await page.locator('input[name="privateTeacher"]').check()
    }
    if (user.schoolTeacher) {
      await page.locator('input[name="schoolTeacher"]').check()
    }

    await page.waitForTimeout(200) // Wait for instrument dropdown if teacher

    await page.locator('input[name="firstName"]').fill(user.firstName)
    await page.locator('input[name="lastName"]').fill(user.lastName)

    if (user.instrument && (user.privateTeacher || user.schoolTeacher)) {
      await page
        .locator('select[name="instrument"]')
        .selectOption({ label: user.instrument })
    }

    await page.locator('input[name="email"]').fill(user.email)
    await page.locator('input[name="password"]').fill(user.password)
    await page.locator('input[name="password2"]').fill(user.password)

    // Submit
    await page.getByRole('button', { name: /register new account/i }).click()

    // Wait for success toast
    await expect(
      page.locator('.Vue-Toastification__toast--success')
    ).toContainText(/check email/i, { timeout: 5000 })
  }

  /**
   * Register using test user preset
   */
  static async registerTestUser(
    page: Page,
    userKey: keyof typeof TEST_USERS
  ): Promise<void> {
    const user = TEST_USERS[userKey]
    await this.registerUser(page, {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      password: user.password,
      privateTeacher:
        user.accountType === 'private_teacher' ||
        user.accountType === 'both_teachers',
      schoolTeacher:
        user.accountType === 'school_teacher' ||
        user.accountType === 'both_teachers',
      instrument: user.instrument,
    })
  }

  /**
   * Verify user is authenticated (on protected page)
   */
  static async verifyAuthenticated(page: Page): Promise<void> {
    await expect(page).toHaveURL(/\/registrations/)
  }

  /**
   * Verify user is not authenticated (redirected to login)
   */
  static async verifyNotAuthenticated(page: Page): Promise<void> {
    await expect(page).toHaveURL(/\/login/)
  }

  /**
   * Logout user via UI
   */
  static async logout(page: Page): Promise<void> {
    // Open user menu
    await page.locator('[data-testid="user-menu"]').click()

    // Click logout
    await page.getByRole('button', { name: /logout/i }).click()

    // Verify redirect to login
    await page.waitForURL('**/login', { timeout: 5000 })
  }

  /**
   * Extract verification token from MailHog API
   */
  static async getVerificationTokenFromMailHog(
    email: string
  ): Promise<string | null> {
    try {
      const response = await fetch('http://localhost:8025/api/v2/messages')
      const data = await response.json()

      // Find the most recent email to this address
      const emailMessage = data.items.find((msg: any) =>
        msg.To.some(
          (recipient: any) => recipient.Mailbox === email.split('@')[0]
        )
      )

      if (!emailMessage) return null

      // Extract token from email body
      // Email body is in Quoted-Printable encoding where:
      // - "=XX" are hex-encoded characters (e.g., =3D is '=')
      // - "=" at end of line indicates soft line break (line continuation)
      // - Lines are wrapped at 76 characters
      let body = emailMessage.Content.Body

      // Remove soft line breaks (= at end of line)
      body = body.replace(/=\r?\n/g, '')

      // Now decode the quoted-printable encoding
      body = body.replace(/=([0-9A-F]{2})/g, (_: string, hex: string) =>
        String.fromCharCode(parseInt(hex, 16))
      )

      // Look for token= in the decoded body
      const tokenMatch = body.match(/token=([a-zA-Z0-9._-]+)/i)

      return tokenMatch ? tokenMatch[1] : null
    } catch (error) {
      console.error('Failed to get verification token from MailHog:', error)
      return null
    }
  }

  /**
   * Delete all emails from MailHog
   */
  static async clearMailHog(): Promise<void> {
    try {
      await fetch('http://localhost:8025/api/v1/messages', {
        method: 'DELETE',
      })
    } catch (error) {
      console.error('Failed to clear MailHog:', error)
    }
  }

  /**
   * Wait for email to arrive in MailHog
   */
  static async waitForEmailInMailHog(
    email: string,
    subject: string,
    timeoutMs: number = 10000
  ): Promise<boolean> {
    const startTime = Date.now()

    while (Date.now() - startTime < timeoutMs) {
      try {
        const response = await fetch('http://localhost:8025/api/v2/messages')
        const data = await response.json()

        const found = data.items.some((msg: any) => {
          const recipientMatch = msg.To.some(
            (recipient: any) => recipient.Mailbox === email.split('@')[0]
          )
          const subjectMatch =
            msg.Content.Headers.Subject &&
            msg.Content.Headers.Subject.some((subj: string) =>
              subj.includes(subject)
            )

          return recipientMatch && subjectMatch
        })

        if (found) return true
      } catch (error) {
        // Continue waiting
        console.log('Error checking MailHog:', error)
      }

      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    return false
  }
}

/**
 * GraphQL helper for direct API testing
 */
export class GraphQLHelper {
  /**
   * Execute GraphQL mutation
   */
  static async executeMutation(
    mutation: string,
    variables: Record<string, any>
  ): Promise<any> {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables,
      }),
    })

    return await response.json()
  }

  /**
   * Execute GraphQL query
   */
  static async executeQuery(
    query: string,
    variables: Record<string, any> = {}
  ): Promise<any> {
    const response = await fetch('http://localhost:3000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    return await response.json()
  }

  /**
   * Sign up user via GraphQL
   */
  static async signUpUser(user: {
    email: string
    password: string
    password2: string
    firstName: string
    lastName: string
    privateTeacher?: boolean
    schoolTeacher?: boolean
    instrument?: string
  }): Promise<any> {
    const mutation = `
      mutation SignUp($input: SignUpInput!) {
        signup(signUpInput: $input) {
          user {
            id
            email
            firstName
            lastName
            isActive
            emailConfirmed
          }
          userErrors {
            message
            field
          }
        }
      }
    `

    return await this.executeMutation(mutation, { input: user })
  }

  /**
   * Sign in user via GraphQL
   */
  static async signInUser(email: string, password: string): Promise<any> {
    const mutation = `
      mutation SignIn($input: SignInInput!) {
        signin(signInInput: $input) {
          user {
            id
            email
            roles
            permissions
            isActive
          }
          userErrors {
            message
            field
          }
        }
      }
    `

    return await this.executeMutation(mutation, {
      input: { email, password },
    })
  }

  /**
   * Check if user exists via email
   */
  static async checkUserByEmail(email: string): Promise<any> {
    const query = `
      query FindUserByEmail($email: String!) {
        findUserByEmail(email: $email) {
          id
          email
          emailConfirmed
          isActive
          roles
        }
      }
    `

    return await this.executeQuery(query, { email })
  }
}
