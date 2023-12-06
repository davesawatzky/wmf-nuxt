import { queries, render, screen } from '@testing-library/vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { expect } from 'vitest'
import '@testing-library/jest-dom'
import Login from './Login.vue'
import { createTestingPinia } from '@pinia/testing'
import { createMockClient } from 'mock-apollo-client'
import { SignInDocument, SignUpDocument } from '~/graphql/gql/graphql'

let mockClient: any
let options: any

beforeEach(() => {
  mockClient = createMockClient()
  mockClient.setRequestHandler(SignInDocument, () =>
    Promise.resolve({
      data: {
        userErrors: {
          message: [],
        },
        diatonicToken: '',
        user: {
          email: 'david@diatonic.io',
          firstName: 'David',
          lastName: 'Sawatzky',
          privateTeacher: true,
          schoolTeacher: false,
          hasSignedIn: true,
        },
      },
    })
  )
  options = {
    global: {
      provide: {
        [DefaultApolloClient]: mockClient,
      },
    },
  }
})

afterEach(() => {
  mockClient = null
})

describe('Test Login and Registration component functions', () => {
  describe('When opening the login page', () => {
    it('Renders an email and password input field', () => {
      const { getByLabelText } = render(Login, options)
      expect(getByLabelText('Email')).toBeInTheDocument()
      expect(getByLabelText('Password')).toBeInTheDocument()
    })

    it('displays the Log In button', () => {
      const { ...queries } = render(Login, options)
      expect(queries.getByRole('button')).toHaveTextContent('Sign In')
    })

    it('displays a checkbox to register an account', () => {
      const { ...queries } = render(Login, options)
      expect(
        queries.getByRole('checkbox', {
          name: 'Register for a New Account',
        })
      ).toBeInTheDocument()
    })
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
