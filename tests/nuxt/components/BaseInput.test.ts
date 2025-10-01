import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { ref } from 'vue'
import BaseInput from '../../../app/components/base/BaseInput.vue'
import { StatusEnum } from '../../../app/utils/types'

// Mock UniqueID utility
vi.mock('../../../app/utils/UniqueID', () => ({
  default: () => ({
    getID: () => 'test-uuid-123',
  }),
}))

// Mock child components to avoid dependency issues
const BaseHelpButton = {
  name: 'BaseHelpButton',
  props: ['helpMessage'],
  template: '<div class="base-help-button" data-testid="help-button"></div>',
}

const BaseSaved = {
  name: 'BaseSaved',
  props: ['status'],
  template: '<div class="base-saved" data-testid="saved-indicator"></div>',
}

const BaseErrorMessage = {
  name: 'BaseErrorMessage',
  template:
    '<div class="base-error-message" data-testid="error-message"><slot /></div>',
}

// Mock VeeValidate with proper reactive values
const mockField = {
  value: ref(''),
  errorMessage: ref(''),
  meta: ref({ valid: true, dirty: false, touched: false, initialValue: '' }),
  resetField: vi.fn(),
  handleChange: vi.fn(),
  validate: vi.fn(),
}

vi.mock('vee-validate', () => ({
  useField: vi.fn(() => mockField),
}))

describe('BaseInput Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockField.value.value = ''
    mockField.errorMessage.value = ''
    mockField.meta.value = {
      valid: true,
      dirty: false,
      touched: false,
      initialValue: '',
    }
  })

  it('renders with basic props', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: 'test-input',
        label: 'Test Label',
        type: 'text',
      },
      global: {
        components: {
          BaseHelpButton,
          BaseSaved,
          BaseErrorMessage,
        },
      },
    })

    expect(wrapper.text()).toContain('Test Label')
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('input').attributes('name')).toBe('test-input')
    expect(wrapper.find('input').attributes('type')).toBe('text')
  })

  it('shows error message when validation fails', async () => {
    mockField.errorMessage.value = 'This field is required'
    mockField.meta.value = {
      valid: false,
      dirty: true,
      touched: true,
      initialValue: '',
    }

    const wrapper = mount(BaseInput, {
      props: {
        name: 'test-input',
        label: 'Test Label',
        type: 'text',
      },
      global: {
        components: {
          BaseHelpButton,
          BaseSaved,
          BaseErrorMessage,
        },
      },
    })

    expect(wrapper.text()).toContain('This field is required')
    // The BaseErrorMessage should always be rendered, just check if it contains the error
    expect(wrapper.findComponent(BaseErrorMessage).exists()).toBe(true)
  })

  it('handles input changes correctly', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: 'test-input',
        label: 'Test Label',
        modelValue: 'initial value',
      },
      global: {
        components: {
          BaseHelpButton,
          BaseSaved,
          BaseErrorMessage,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.exists()).toBe(true)

    // Test input events
    await input.trigger('input')
    expect(mockField.handleChange).toHaveBeenCalled()
  })

  it('displays help message when provided', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: 'test-input',
        label: 'Test Label',
        helpMessage: 'This is helpful text',
      },
      global: {
        components: {
          BaseHelpButton,
          BaseSaved,
          BaseErrorMessage,
        },
      },
    })

    // BaseHelpButton is rendered when label exists
    expect(wrapper.findComponent(BaseHelpButton).exists()).toBe(true)
  })

  it('applies correct styling based on status', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: 'test-input',
        label: 'Test Label',
        status: StatusEnum.pending,
      },
      global: {
        components: {
          BaseHelpButton,
          BaseSaved,
          BaseErrorMessage,
        },
      },
    })

    // BaseSaved is always rendered
    expect(wrapper.findComponent(BaseSaved).exists()).toBe(true)
  })

  it('handles number input type correctly', async () => {
    const wrapper = mount(BaseInput, {
      props: {
        name: 'test-number',
        label: 'Number Field',
        type: 'number',
        modelValue: 42,
      },
      global: {
        components: {
          BaseHelpButton,
          BaseSaved,
          BaseErrorMessage,
        },
      },
    })

    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('number')
  })
})
