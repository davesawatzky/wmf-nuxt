import { renderSuspended } from 'nuxt-vitest/utils'
import { createTestingPinia } from '@pinia/testing'

import { screen } from '@testing-library/vue'

describe('Test Login and Registration component functions', () => {
  describe('When opening the login page', () => {
    it('Renders an email and password input field', async () => {
      await renderSuspended('Login', { route: '/login' })
      expect(screen.findByLabelText('Email')).toBeTruthy()
      expect(screen.findByLabelText('Password')).toBeTruthy()
    })
    it('displays the Log In button', async () => {})
    it('displays a link to register an account', () => {})
  })
  describe('Logging in', () => {
    describe('When a user enters their email to login', () => {
      it('shows up in email input', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })

    describe('When password is entered', () => {
      it('show up in the password input', () => {})
      it('uses hidden characters', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
        it('Logging in is disabled', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('When both email and password are valid', () => {
      it('Loggin in is enabled', () => {})
    })
    describe('When either email or password are invalid', () => {
      it('Loggin in is disabled', () => {})
    })
    describe('When log in button is clicked', () => {
      it('displays a loading indicator', () => {})
      it('Loads the user information', () => {})
      it('receives a login token in a cookie', () => {})
      it('Opens the registration page', () => {})
    })
    describe('When the enter key is pressed', () => {
      it('displays a loading indicator', () => {})
      it('Loads the user information', () => {})
      it('receives a login token in a cookie', () => {})
      it('Opens the registration page', () => {})
    })
    describe('If the user is not found', () => {
      it('displays an error', () => {})
      it('resets all fields', () => {})
    })
  })

  describe('Registering an account', () => {
    it('displays a login page link', () => {})
    describe('When clicking the registration link', () => {
      it('renders the registration page', () => {})
      it('renders first name, last name, email, and 2 password fields', () => {})
    })
    it('displays a "Register Account" button', () => {})
    it('displays a login link', () => {})

    describe('When a user enters their first name to the input', () => {
      it('shows up in first name input', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('When a user enters their last name to the input', () => {
      it('shows up in last name input', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })

    describe('When password is entered', () => {
      it('show up in the password input', () => {})
      it('uses hidden characters', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
        it('Logging in is disabled', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('When password is reentered', () => {
      it('show up in the password input', () => {})
      it('uses hidden characters', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
        it('Logging in is disabled', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('When all fields are valid', () => {
      it('Registering is enabled', () => {})
    })
    describe('When Register New Accoun button is clicked', () => {
      it('checks if account already exists', () => {})
    })
    describe('If new account is confirmed', () => {
      it('Records new account information', () => {})
      it('Logs in the new user', () => {})
      it('Shows the loading indicator', () => {})
      it('Loads the registration page', () => {})
    })
    describe('If account already exists', () => {
      it('shows an error', () => {})
      it('does not create the account', () => {})
      it('Clears the registration fields', () => {})
    })
  })
})
