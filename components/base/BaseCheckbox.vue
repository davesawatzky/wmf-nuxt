<script setup lang="ts">
  defineProps<{
    label: string
    modelValue: boolean
  }>()

  defineEmits<{
    'update:modelValue': [value: boolean]
  }>()
</script>

<template>
  <div>
    <input
      type="checkbox"
      :checked="modelValue"
      @change="
        $emit('update:modelValue', ($event.target as HTMLInputElement).checked)
      " />
    <label
      v-if="label"
      class="pl-4"
      >{{ label }}</label
    >
  </div>
</template>
