<template>
  <div class="preview-content">
    <div class="ql-container">
      <div
        class="prose ql-editor pdf-content-area"
        ref="editorRef"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    content: string
  }>()

  const editorRef = ref<HTMLElement | null>(null)

  onMounted(() => {
    console.log(
      'PreviewContent mounted, content length:',
      (props.content || '').length
    )
    updateContent()
  })

  watch(
    () => props.content,
    () => {
      updateContent()
    },
    { immediate: true }
  )

  // Update content directly without v-html
  function updateContent() {
    if (!editorRef.value) return

    const content = props.content || ''
    console.log('Updating content, length:', content.length)

    if (!content) {
      console.warn('PreviewContent: No content provided')
      editorRef.value.innerHTML = ''
      return
    }

    // Set content directly without DOMPurify
    // This is safe because we're in a controlled environment
    // and the content comes from our own application
    editorRef.value.innerHTML = content
  }
</script>

<style>
  .preview-content {
    width: 100%;
    height: 100%;
    background: #f5f5f5;
    overflow: auto;
    padding: 20px;
    margin: 0;
    display: flex;
    justify-content: center;
  }

  .preview-content .ql-container {
    height: 100%;
    border: none;
    padding: 0;
    margin: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    background: white;
    width: 100%;
  }

  .preview-content .ql-editor {
    height: auto;
    min-height: 100%;
    padding: 2em;
    font-family: Arial, sans-serif;
    color: black;
    background: white;
    overflow-y: auto;
    box-sizing: border-box;
    /* max-width: 816px; */
    /* A4 width in pixels at 96 DPI */
    margin: 0 auto;
    border: 1px solid #e0e0e0;
    width: 100%;
  }

  .pdf-content-area {
    width: 100%;
    box-sizing: border-box;
  }

  /* Typography */
  .preview-content .ql-editor p {
    margin-bottom: 1em;
    color: black !important;
  }

  .preview-content .ql-editor h1 {
    font-size: 24pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .preview-content .ql-editor h2 {
    font-size: 20pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .preview-content .ql-editor h3 {
    font-size: 16pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .preview-content .ql-editor h4,
  .preview-content .ql-editor h5,
  .preview-content .ql-editor h6 {
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  /* Lists */
  .preview-content .ql-editor ul,
  .preview-content .ql-editor ol {
    padding-left: 2em;
    margin-bottom: 1em;
    color: black !important;
  }

  .preview-content .ql-editor li {
    margin-bottom: 0.5em;
    color: black !important;
  }

  /* Links */
  .preview-content .ql-editor a {
    color: #0066cc !important;
    text-decoration: underline;
  }

  /* Inline styles */
  .preview-content .ql-editor strong {
    font-weight: bold;
    color: black !important;
  }

  .preview-content .ql-editor em {
    font-style: italic;
    color: black !important;
  }

  .preview-content .ql-editor u {
    text-decoration: underline;
    color: black !important;
  }

  .preview-content .ql-editor s {
    text-decoration: line-through;
    color: black !important;
  }

  /* Table styles */
  .preview-content .ql-editor table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    table-layout: fixed;
  }

  .preview-content .ql-editor table td,
  .preview-content .ql-editor table th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    word-break: break-word;
    color: black !important;
  }

  .preview-content .ql-editor table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
  }

  /* Text alignment */
  .preview-content .ql-editor [style*='text-align: center'],
  .preview-content .ql-editor [data-align='center'],
  .preview-content .ql-editor [data-text-align='center'] {
    text-align: center !important;
  }

  .preview-content .ql-editor [style*='text-align: right'],
  .preview-content .ql-editor [data-align='right'],
  .preview-content .ql-editor [data-text-align='right'] {
    text-align: right !important;
  }

  .preview-content .ql-editor [style*='text-align: justify'],
  .preview-content .ql-editor [data-align='justify'],
  .preview-content .ql-editor [data-text-align='justify'] {
    text-align: justify !important;
  }

  .preview-content .ql-editor [style*='text-align: left'],
  .preview-content .ql-editor [data-align='left'],
  .preview-content .ql-editor [data-text-align='left'] {
    text-align: left !important;
  }

  /* Ensure all content is visible */
  .preview-content .ql-editor * {
    max-width: 100%;
  }

  /* Spacing for elements */
  .preview-content .ql-editor div {
    margin-bottom: 1em;
  }

  /* Preserve whitespace in preformatted text */
  .preview-content .ql-editor pre {
    white-space: pre-wrap;
    background-color: #f5f5f5;
    padding: 1em;
    border-radius: 4px;
    overflow-x: auto;
    margin: 1em 0;
  }

  .preview-content .ql-editor code {
    font-family: 'Courier New', Courier, monospace;
    font-size: 0.9em;
  }

  /* Scrollbar styling */
  .preview-content::-webkit-scrollbar {
    width: 8px;
  }

  .preview-content::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  .preview-content::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }

  .preview-content::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  @media print {
    .preview-content {
      padding: 0;
      background: white;
    }

    .preview-content .ql-editor {
      box-shadow: none;
      border: none;
    }
  }
</style>
