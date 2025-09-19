// Test setup for Vitest
import { vi } from 'vitest'

// Mock Vue dependencies
vi.stubGlobal(
  'isRef',
  vi.fn(() => false)
)
vi.stubGlobal(
  'ref',
  vi.fn((val) => ({ value: val }))
)
vi.stubGlobal(
  'computed',
  vi.fn((fn) => ({ value: fn() }))
)
vi.stubGlobal(
  'reactive',
  vi.fn((obj) => obj)
)
vi.stubGlobal('defineStore', vi.fn())

// Mock Nuxt composables
vi.mock('#app', () => ({
  navigateTo: vi.fn(),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
  useRoute: () => ({
    path: '/',
    params: {},
    query: {},
  }),
}))

// Mock Apollo Client
vi.mock('#apollo', () => ({
  useQuery: vi.fn(),
  useMutation: vi.fn(),
}))

// Global test setup
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
}
