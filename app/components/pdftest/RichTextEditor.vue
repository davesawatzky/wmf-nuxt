<template>
  <div>
    <div class="richtext-editor">
      <TiptapEditor v-model="modelValue" />
    </div>
    <div
      v-if="previewContent"
      class="preview-overlay prose"
      v-html="previewContent"></div>
  </div>
</template>

<script setup lang="ts">
  const modelValue = defineModel()

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
