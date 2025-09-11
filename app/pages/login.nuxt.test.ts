import { render } from '@testing-library/vue'
import { DefaultApolloClient } from '@vue/apollo-composable'
import { expect } from 'vitest'
import '@testing-library/jest-dom'
import { createMockClient } from 'mock-apollo-client'
import Login from './Login.vue'
import { SignInDocument } from '~/graphql/gql/graphql'

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
          isActive: true,
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

describe('test Login and Registration component functions', () => {
  describe('when opening the login page', () => {
    it('renders an email and password input field', () => {
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

  describe('logging in', () => {
    describe('when a user enters their email to login', () => {
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })

    describe('when password is entered', () => {
      it('uses hidden characters', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
        it('logging in is disabled', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('when both email and password are valid', () => {
      it('loggin in is enabled', () => {})
    })
    describe('when either email or password are invalid', () => {
      it('loggin in is disabled', () => {})
    })
    describe('when log in button is clicked', () => {
      it('displays a loading indicator', () => {})
      it('loads the user information', () => {})
      it('receives a login token in a cookie', () => {})
      it('opens the registration page', () => {})
    })
    describe('when the enter key is pressed', () => {
      it('displays a loading indicator', () => {})
      it('loads the user information', () => {})
      it('receives a login token in a cookie', () => {})
      it('opens the registration page', () => {})
    })
    describe('if the user is not found', () => {
      it('displays an error', () => {})
      it('resets all fields', () => {})
    })
  })

  describe('registering an account', () => {
    it('displays a login page link', () => {})
    describe('when clicking the registration link', () => {
      it('renders the registration page', () => {})
      it('renders first name, last name, email, and 2 password fields', () => {})
    })
    it('displays a "Register Account" button', () => {})
    it('displays a login link', () => {})

    describe('when a user enters their first name to the input', () => {
      it('shows up in first name input', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('when a user enters their last name to the input', () => {
      it('shows up in last name input', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })

    describe('when password is entered', () => {
      it('show up in the password input', () => {})
      it('uses hidden characters', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
        it('logging in is disabled', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('when password is reentered', () => {
      it('show up in the password input', () => {})
      it('uses hidden characters', () => {})
      it('gets validated', () => {})
      describe('when invalid', () => {
        it('shows an error in red under the input', () => {})
        it('logging in is disabled', () => {})
      })
      describe('when valid', () => {
        it('does not show an error', () => {})
      })
    })
    describe('when all fields are valid', () => {
      it('registering is enabled', () => {})
    })
    describe('when Register New Accoun button is clicked', () => {
      it('checks if account already exists', () => {})
    })
    describe('if new account is confirmed', () => {
      it('records new account information', () => {})
      it('logs in the new user', () => {})
      it('shows the loading indicator', () => {})
      it('loads the registration page', () => {})
    })
    describe('if account already exists', () => {
      it('shows an error', () => {})
      it('does not create the account', () => {})
      it('clears the registration fields', () => {})
    })
  })
})
