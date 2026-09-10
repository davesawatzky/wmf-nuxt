<script setup lang="ts">
defineProps<{
  previewContent?: string
}>()

defineEmits<{
  'update:modelValue': [htmlValue: string]
}>()

const modelValue = defineModel({ type: String, default: '' })
</script>

<template>
  <div>
    <div class="richtext-editor">
      <adminReportsTiptapEditor v-model="modelValue" />
    </div>
    <div
      v-if="previewContent"
      class="preview-overlay prose"
      v-html="previewContent"
    />
  </div>
</template>

<style>
  /* include styles */
</style>
