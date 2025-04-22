<template>
  <button
    :class="buttonClasses"
    :title="title">
    <Icon
      v-if="icon"
      :name="icon"
      :size="iconSize"
      class="mr-2" />
    <slot />
  </button>
</template>

<script setup lang="ts">
  import { computed, defineProps } from 'vue'

  type ButtonSize = 'sm' | 'md' | 'lg'
  type ButtonVariant = 'primary' | 'secondary'

  const props = defineProps<{
    variant?: ButtonVariant
    size?: ButtonSize
    icon?: string
    title?: string
  }>()

  const buttonClasses = computed(() => {
    const baseClasses = [
      'inline-flex items-center justify-center rounded font-medium transition-colors duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
    ]

    // Size classes
    const sizeClasses = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    }

    // Variant classes
    const variantClasses = {
      primary:
        'bg-primary-600 hover:bg-primary-700 text-white focus:ring-primary-500',
      secondary:
        'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-primary-500 border border-gray-300',
    }

    return [
      ...baseClasses,
      sizeClasses[props.size || 'md'],
      variantClasses[props.variant || 'primary'],
    ]
  })

  const iconSize = computed(() => {
    const sizes = {
      sm: '16',
      md: '20',
      lg: '24',
    }
    return sizes[props.size || 'md']
  })
</script>

<style>
  /* Add explicit button styles to override any issues with CSS variables */
  button.bg-gray-200 {
    background-color: #e5e7eb !important;
    color: #1f2937 !important;
    border: 1px solid #d1d5db !important;
  }

  button.bg-gray-200:hover {
    background-color: #d1d5db !important;
  }

  button.bg-primary-600 {
    background-color: #2563eb !important;
    color: white !important;
  }

  button.bg-primary-600:hover {
    background-color: #1d4ed8 !important;
  }
</style>
