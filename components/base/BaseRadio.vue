<script setup lang="ts">
  const props = defineProps<{
    label?: string
    description?: string
    name: string
    modelValue?: string | number
    val: string | number
  }>()

  const emit = defineEmits<{
    'update:modelValue': [value: string | number]
  }>()
</script>

<template>
  <div>
    <input
      :id="String(val)"
      type="radio"
      :checked="modelValue === val"
      :value="val"
      :name="name"
      v-bind="{ ...$attrs }"
      @change="$emit('update:modelValue', val)" />
    <label
      v-if="label"
      :for="String(val)"
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
