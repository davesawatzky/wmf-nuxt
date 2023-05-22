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
    for="toggleA"
    class="items-center m-5 cursor-pointer">
    <div class="relative">
      <input
        id="toggleA"
        vbind="$attrs"
        type="checkbox"
        :checked="modelValue"
        class="sr-only"
        @change="$emit('update:modelValue', $event.target)" />
      <!-- line -->
      <div class="w-10 h-4 bg-gray-400 rounded-full shadow-inner" />
      <!-- dot -->
      <div
        class="dot absolute w-6 h-6 bg-white rounded-full shadow -left-1 -top-1 transition" />
    </div>
    <div
      v-if="label"
      class="ml-3">
      {{ label }}
    </div>
  </label>
</template>

<style scoped>
  input:checked ~ .dot {
    transform: translateX(100%);
  }
</style>
