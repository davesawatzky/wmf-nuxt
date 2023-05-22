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
  <label
    for="toggleB"
    class="items-center m-5 cursor-pointer">
    <div class="relative">
      <input
        id="toggleB"
        vbind="$attrs"
        type="checkbox"
        :checked="modelValue"
        class="sr-only"
        @change="$emit('update:modelValue', $event.target)" />
      <!-- line -->
      <div class="block bg-gray-600 w-14 h-8 rounded-full" />
      <!-- dot -->
      <div
        class="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition" />
    </div>

    <div
      v-if="label"
      class="ml-3">
      {{ label }}
    </div>
  </label>
</template>

<style scoped>
  /* Toggle B */
  input:checked ~ .dot {
    transform: translateX(100%);
  }
</style>
