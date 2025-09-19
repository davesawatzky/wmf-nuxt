// tests/setup-unit.ts - Setup for pure unit tests (no Nuxt runtime)
import { vi } from 'vitest'

// Mock Vue reactivity functions for unit tests
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
vi.stubGlobal(
  'readonly',
  vi.fn((obj) => obj)
)
vi.stubGlobal('watch', vi.fn())
vi.stubGlobal('watchEffect', vi.fn())

// Mock basic browser APIs
Object.defineProperty(global, 'localStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
})

Object.defineProperty(global, 'sessionStorage', {
  value: {
    getItem: vi.fn(() => null),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
})

// Suppress console output in unit tests
global.console = {
  ...console,
  log: vi.fn(),
  warn: vi.fn(),
  error: console.error, // Keep errors visible for debugging
}
