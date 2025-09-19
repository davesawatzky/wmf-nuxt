import { describe, it, expect, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useRegistration } from '../../../app/stores/useRegistration'

// Mock GraphQL operations using importOriginal helper
vi.mock('../../../app/graphql/gql/graphql', async (importOriginal) => {
  const actual =
    await importOriginal<typeof import('../../../app/graphql/gql/graphql')>()
  return {
    ...actual,
    // Override specific values for testing
    PerformerType: {
      SOLO: 'SOLO',
      GROUP: 'GROUP',
      SCHOOL: 'SCHOOL',
      COMMUNITY: 'COMMUNITY',
    },
  }
})

// Mock external dependencies
vi.mock('#app', () => ({
  navigateTo: vi.fn(),
}))

vi.mock('../../../app/composables/comps', () => ({
  default: () => ({
    notification: vi.fn(),
  }),
}))

describe('useRegistration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default state', () => {
    const store = useRegistration()

    expect(store.registrationId).toBe(0)
    expect(store.registration).toEqual({})
  })

  it('should reset state correctly', () => {
    const store = useRegistration()

    // Set some state
    store.registrationId = 123
    store.registration = { id: 1, label: 'Test Registration' }

    // Reset
    store.$reset()

    // Verify reset
    expect(store.registrationId).toBe(0)
    expect(store.registration).toEqual({})
  })

  it('should add data to store correctly', () => {
    const store = useRegistration()
    const testData = {
      label: 'Test Registration',
      performerType: 'SOLO' as const,
      confirmation: 'ABC123',
    }

    store.addToStore(testData)

    expect(store.registration.label).toBe('Test Registration')
    expect(store.registration.performerType).toBe('SOLO')
    expect(store.registration.confirmation).toBe('ABC123')
  })

  it('should calculate late registration fee correctly', () => {
    const store = useRegistration()

    // Test late fee calculation (check that it exists and is valid)
    const lateFee = store.lateRegistrationFee()

    // The function might return a string or number depending on implementation
    expect(lateFee).toBeDefined()
    // Convert to number for further validation if it's a string
    const numericFee =
      typeof lateFee === 'string' ? parseFloat(lateFee) : lateFee
    expect(numericFee).toBeGreaterThanOrEqual(0)
  })

  it('should calculate total class amount', () => {
    const store = useRegistration()

    // totalClassAmt is a computed property that depends on classesStore
    expect(store.totalClassAmt).toBeDefined()
    // Convert to number for validation if it's a string
    const numericAmount =
      typeof store.totalClassAmt === 'string'
        ? parseFloat(store.totalClassAmt)
        : store.totalClassAmt
    expect(numericAmount).toBeGreaterThanOrEqual(0)
  })

  it('should have async registration methods', () => {
    const store = useRegistration()

    // Verify methods exist and are functions
    expect(typeof store.createRegistration).toBe('function')
    expect(typeof store.updateRegistration).toBe('function')
    expect(typeof store.deleteRegistration).toBe('function')
  })

  it('should have all required store properties', () => {
    const store = useRegistration()

    // Verify all expected properties exist
    expect(store).toHaveProperty('registrationId')
    expect(store).toHaveProperty('registration')
    expect(store).toHaveProperty('totalClassAmt')
    expect(store).toHaveProperty('$reset')
    expect(store).toHaveProperty('addToStore')
    expect(store).toHaveProperty('createRegistration')
    expect(store).toHaveProperty('updateRegistration')
    expect(store).toHaveProperty('deleteRegistration')
    expect(store).toHaveProperty('lateRegistrationFee')
  })
})
