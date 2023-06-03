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
  <div>
  <input
    type="checkbox"
    :checked="modelValue"
    @change="
      $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
    " />
  <label v-if="label">{{ label }}</label>
  </div>
</template>
