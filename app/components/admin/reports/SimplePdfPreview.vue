<template>
  <div class="pdf-preview">
    <div
      class="page"
      ref="pageRef"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, watch } from 'vue'

  const props = defineProps<{
    content: string
  }>()

  const pageRef = ref<HTMLElement | null>(null)

  // Update content when component mounts
  onMounted(() => {
    updateContent()
  })

  // Watch for content changes
  watch(
    () => props.content,
    () => {
      updateContent()
    }
  )

  // Update the content in the page
  function updateContent() {
    if (!pageRef.value) return

    const content = props.content || ''
    if (!content) {
      pageRef.value.innerHTML =
        '<div class="empty-message">No content to preview</div>'
      return
    }

    // Set content directly
    pageRef.value.innerHTML = content
  }
</script>

<style>
  .pdf-preview {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: #f5f5f5;
    padding: 20px;
    display: flex;
    justify-content: center;
  }

  .page {
    width: 8.5in;
    min-height: 11in;
    padding: 1in;
    margin: 0 auto;
    background: white;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    color: black;
    box-sizing: border-box;
    overflow-y: visible;
  }

  /* Typography */
  .page p {
    /* margin-bottom: 1em; */
    color: black !important;
  }

  .page h1 {
    font-size: 24pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .page h2 {
    font-size: 20pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .page h3 {
    font-size: 16pt;
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  .page h4,
  .page h5,
  .page h6 {
    font-weight: bold;
    margin: 1em 0 0.5em;
    page-break-after: avoid;
    color: black !important;
  }

  /* Lists */
  .page ul,
  .page ol {
    padding-left: 2em;
    margin-bottom: 1em;
    color: black !important;
  }

  .page li {
    margin-bottom: 0.5em;
    color: black !important;
  }

  /* Links */
  .page a {
    color: #0066cc !important;
    text-decoration: underline;
  }

  /* Inline styles */
  .page strong {
    font-weight: bold;
    color: black !important;
  }

  .page em {
    font-style: italic;
    color: black !important;
  }

  .page u {
    text-decoration: underline;
    color: black !important;
  }

  .page s {
    text-decoration: line-through;
    color: black !important;
  }

  /* Table styles */
  .page table {
    width: 100%;
    border-collapse: collapse;
    margin: 1em 0;
    table-layout: fixed;
  }

  .page table td,
  .page table th {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
    word-break: break-word;
    color: black !important;
  }

  .page table th {
    background-color: #f2f2f2;
    font-weight: bold;
    text-align: center;
  }

  /* Text alignment */
  .page [style*='text-align: center'],
  .page [data-align='center'],
  .page [data-text-align='center'] {
    text-align: center !important;
  }

  .page [style*='text-align: right'],
  .page [data-align='right'],
  .page [data-text-align='right'] {
    text-align: right !important;
  }

  .page [style*='text-align: justify'],
  .page [data-align='justify'],
  .page [data-text-align='justify'] {
    text-align: justify !important;
  }

  .page [style*='text-align: left'],
  .page [data-align='left'],
  .page [data-text-align='left'] {
    text-align: left !important;
  }

  /* Ensure all content is visible */
  .page * {
    max-width: 100%;
  }

  /* Empty message */
  .empty-message {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 16px;
    color: #666;
    text-align: center;
  }

  @media print {
    .pdf-preview {
      padding: 0;
      background: white;
    }

    .page {
      box-shadow: none;
      border: none;
    }
  }
</style>
