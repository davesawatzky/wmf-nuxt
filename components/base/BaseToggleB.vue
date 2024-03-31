<script setup lang="ts">
interface Toggle {
  label: string
  modelValue: boolean
}
const props = withDefaults(defineProps<Toggle>(), {
  label: '',
  modelValue: false,
})

const emits = defineEmits<{
  'update:modelValue': [value: boolean]
}>()
</script>

<template>
  <label
    for="toggleB"
    class="flex gap-3 text-md w-20 items-center m-5 cursor-pointer"
  >
    <div
      v-if="label"
      class="ml-3"
    >
      {{ label }}
    </div>
    <div class="relative">
      <input
        id="toggleB"
        vbind="$attrs"
        type="checkbox"
        :checked="!modelValue"
        class="sr-only"
        @change="$emit('update:modelValue', !modelValue)"
      >
      <!-- line -->
      <div
        class="block w-10 h-6 rounded-full"
        :class="!modelValue ? 'bg-sky-600' : 'bg-gray-600'"
      />
      <!-- dot -->
      <div
        class="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"
      />
    </div>
  </label>
</template>

<style scoped>
  /* Toggle B */
  input:checked ~ .dot {
    transform: translateX(100%);
  }
</style>
