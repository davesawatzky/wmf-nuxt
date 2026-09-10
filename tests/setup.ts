// tests/setup.ts - Setup for Nuxt-integrated tests
import { vi } from 'vitest'
import { config } from '@vue/test-utils'
import { ref } from 'vue'
import '@testing-library/jest-dom/vitest'

// Disable Apollo Client module loading entirely
vi.mock('@nuxtjs/apollo', () => ({
  default: {},
  __nuxtModule: {},
}))

// Mock Apollo Client with minimal implementation
vi.mock('@apollo/client', () => ({
  ApolloClient: vi.fn(),
  InMemoryCache: vi.fn(),
  createHttpLink: vi.fn(),
  gql: vi.fn(),
}))

// Mock VeeValidate
vi.mock('vee-validate', () => ({
  useField: vi.fn(() => ({
    value: ref(''),
    errorMessage: ref(''),
    meta: ref({
      valid: true,
      invalid: false,
      dirty: false,
      touched: false,
      pending: false,
      initialValue: undefined,
    }),
    setValue: vi.fn(),
    setErrors: vi.fn(),
    validate: vi.fn(() => Promise.resolve({ valid: true })),
  })),
  configure: vi.fn(),
  Field: vi.fn(),
  Form: vi.fn(),
  ErrorMessage: vi.fn(),
}))

// Mock Nuxt composables
vi.mock('nuxt/app', () => ({
  useNuxtApp: vi.fn(() => ({
    $apollo: {
      default: {
        query: vi.fn(() => Promise.resolve({ data: {} })),
        mutate: vi.fn(() => Promise.resolve({ data: {} })),
      },
    },
  })),
  useState: vi.fn((key, init) => ref(init ? init() : null)),
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    replace: vi.fn(),
    go: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
  })),
  useRoute: vi.fn(() => ({
    path: '/',
    params: {},
    query: {},
    hash: '',
    meta: {},
  })),
  navigateTo: vi.fn(),
  useRuntimeConfig: vi.fn(() => ({
    public: {
      apollo: {
        clients: {
          default: {
            httpEndpoint: 'http://localhost:3000/graphql',
          },
        },
      },
    },
  })),
  useStorage: vi.fn(() => ref({})),
  defineNuxtPlugin: vi.fn((plugin) => plugin),
  createError: vi.fn(),
  showError: vi.fn(),
  clearError: vi.fn(),
  isNuxtError: vi.fn(),
  useHead: vi.fn(),
  useSeoMeta: vi.fn(),
  useServerSeoMeta: vi.fn(),
  useLazyFetch: vi.fn(),
  useFetch: vi.fn(),
  $fetch: vi.fn(),
}))

// Mock Stripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(null)),
}))

// Mock browser APIs
global.ResizeObserver = vi.fn(function ResizeObserver() {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }
}) as any

global.IntersectionObserver = vi.fn(function IntersectionObserver() {
  return {
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
    takeRecords: vi.fn(() => []),
    root: null,
    rootMargin: '',
    thresholds: [],
  }
}) as any

// Configure Vue Test Utils
config.global.renderStubDefaultSlot = true
config.global.mocks = {
  $t: (key: string) => key,
}

// Mock window APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
})

Object.defineProperty(window, 'sessionStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
})

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
