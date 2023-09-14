<script setup lang="ts">
  const props = defineProps<{
    label?: string
    description?: string
    name: string
    modelValue?: string | number
    value: string | number
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()
</script>

<template>
  <div>
    <input
      :id="String(value)"
      class="cursor-pointer"
      type="radio"
      :checked="modelValue === value"
      :value="value"
      :name="name"
      v-bind="{ ...$attrs }"
      @change="$emit('update:modelValue', value)" />
    <label
      v-if="label"
      :for="String(value)"
      class="pl-2"
      >{{ label }}</label
    >
    <p
      v-if="description"
      class="text-sm sm:text-md">
      {{ description }}
    </p>
  </div>
</template>
