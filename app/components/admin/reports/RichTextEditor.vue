<template>
  <div>
    <div class="richtext-editor">
      <adminReportsTiptapEditor v-model="modelValue" />
    </div>
    <!-- <div
      v-if="previewContent"
      class="preview-overlay prose"
      v-html="previewContent"></div> -->
  </div>
</template>

<script setup lang="ts">
  const modelValue = defineModel({ type: String, default: '' })

  defineProps<{
    previewContent?: string
  }>()

  defineEmits<{
    'update:modelValue': [htmlValue: string]
  }>()
</script>

<style>
  /* include styles */
</style>
