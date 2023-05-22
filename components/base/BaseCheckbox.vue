<script setup lang="ts">
  defineProps({
    label: {
      type: String,
      default: '',
    },
    modelValue: {
      type: Boolean,
      default: false,
    },
  })
  defineEmits(['update:modelValue'])
</script>

<template>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="
      $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
    " />
  <label v-if="label">{{ label }}</label>
</template>
