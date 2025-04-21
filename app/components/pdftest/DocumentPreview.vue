<template>
  <div class="flex flex-col h-full">
    <div class="toolbar">
      <div class="tab-group">
        <pdftestButton
          :variant="activeTab === 'pdf' ? 'primary' : 'secondary'"
          icon="lucide:file"
          size="sm"
          @click="switchToPdf">
          PDF Preview
        </pdftestButton>
        <pdftestButton
          :variant="activeTab === 'richText' ? 'primary' : 'secondary'"
          icon="lucide:edit"
          size="sm"
          @click="activeTab = 'richText'">
          Rich Text
        </pdftestButton>
      </div>
      <div class="toolbar-actions">
        <pdftestButton
          v-if="activeTab === 'pdf'"
          variant="secondary"
          icon="lucide:download"
          size="sm"
          @click="downloadPdf"
          title="Download PDF">
          Download PDF
        </pdftestButton>
      </div>
    </div>

    <div
      v-if="activeTab === 'pdf'"
      class="editor-container flex-1 pdf-preview-container">
      <div
        ref="pdfContainer"
        class="pdf-content h-full">
        <ClientOnly>
          <div v-if="hasContent">
            <pdftestSimplePdfPreview :content="documentStore.mergedContent" />
          </div>
          <div
            v-else
            class="empty-content">
            No content to preview. Please add content in the Rich Text editor.
          </div>
        </ClientOnly>
      </div>
    </div>

    <div
      v-else-if="activeTab === 'richText'"
      class="editor-container flex-1">
      <ClientOnly>
        <pdftestRichTextEditor
          v-model="documentStore.template"
          :preview-content="documentStore.mergedContent"
          @change="handleRichTextUpdate" />
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    data: Record<string, any>
  }>()

  const documentStore = useDocumentStore()
  const activeTab = ref('pdf')
  const pdfContainer = ref<HTMLElement | null>(null)

  // Debug computed property to check content
  const hasContent = computed(() => {
    const content = documentStore.mergedContent || ''
    console.log('Content length in DocumentPreview:', content.length)
    return content.length > 0
  })

  // Watch for data changes
  watch(
    () => props.data,
    (newData) => {
      documentStore.updateJsonData(newData)
    },
    { immediate: true, deep: true }
  )

  // Watch for content changes
  watch(
    () => documentStore.mergedContent,
    (newContent) => {
      console.log(
        'Content changed in DocumentPreview, length:',
        (newContent || '').length
      )
    },
    { immediate: true }
  )

  const handleRichTextUpdate = (content: HTMLElement) => {
    documentStore.updateTemplate(content.innerHTML)
  }

  const switchToPdf = () => {
    activeTab.value = 'pdf'
    nextTick(() => {
      console.log(
        'Switched to PDF tab, content length:',
        documentStore.mergedContent?.length || 0
      )
    })
  }

  const downloadPdf = async () => {
    try {
      // Check if we have content
      if (!documentStore.mergedContent) {
        alert('No content to generate PDF from')
        return
      }

      // Create a new window for printing
      const printWindow = window.open('', '_blank')
      if (!printWindow) {
        alert('Please allow popups to download the PDF')
        return
      }

      // Create the HTML document structure
      const doc = printWindow.document

      // Write the document structure
      doc.open()
      doc.write('<!DOCTYPE html>')
      doc.write('<html>')
      doc.write('<head>')
      doc.write('<title>Document</title>')

      // Add CSS styles
      doc.write('<style>')
      doc.write('@page { size: A4; margin: 0.5in; }')
      doc.write(
        'body { font-family: Arial, sans-serif; line-height: 1.5; color: black; background: white; margin: 0; padding: 0; }'
      )
      doc.write(
        '.page { width: 100%; max-width: 8.3in; margin: 0 auto; box-sizing: border-box; }'
      )
      doc.write('p { margin-bottom: 1em; color: black !important; }')
      doc.write(
        'h1 { font-size: 24pt; font-weight: bold; margin: 1em 0 0.5em; color: black !important; }'
      )
      doc.write(
        'h2 { font-size: 20pt; font-weight: bold; margin: 1em 0 0.5em; color: black !important; }'
      )
      doc.write(
        'h3 { font-size: 16pt; font-weight: bold; margin: 1em 0 0.5em; color: black !important; }'
      )
      doc.write(
        'h4, h5, h6 { font-weight: bold; margin: 1em 0 0.5em; color: black !important; }'
      )
      doc.write('ul, ol { padding-left: 2em; margin-bottom: 1em; }')
      doc.write('li { margin-bottom: 0.5em; }')
      doc.write(
        'table { width: 100%; border-collapse: collapse; margin: 1em 0; table-layout: fixed; }'
      )
      doc.write(
        'td, th { border: 1px solid #ddd; padding: 8px; text-align: left; word-break: break-word; }'
      )
      doc.write(
        'th { background-color: #f2f2f2; font-weight: bold; text-align: center; }'
      )
      doc.write('strong { font-weight: bold; color: black !important; }')
      doc.write('em { font-style: italic; color: black !important; }')
      doc.write('u { text-decoration: underline; color: black !important; }')
      doc.write(
        '[style*="text-align: center"], [data-align="center"], [data-text-align="center"] { text-align: center !important; }'
      )
      doc.write(
        '[style*="text-align: right"], [data-align="right"], [data-text-align="right"] { text-align: right !important; }'
      )
      doc.write(
        '[style*="text-align: justify"], [data-align="justify"], [data-text-align="justify"] { text-align: justify !important; }'
      )
      doc.write(
        '[style*="text-align: left"], [data-align="left"], [data-text-align="left"] { text-align: left !important; }'
      )
      doc.write(
        '@media print { body { padding: 0; margin: 0; } .page { max-width: none; width: 100%; padding: 0 0.2in; } }'
      )
      doc.write('</style>')
      doc.write('</head>')
      doc.write('<body>')
      doc.write('<div class="page">')

      // Add the content
      doc.write(documentStore.mergedContent)

      doc.write('</div>')

      // Add script for auto-printing
      doc.write('<script>')
      doc.write('window.onload = function() {')
      doc.write('  setTimeout(function() {')
      doc.write('    window.print();')
      doc.write('    setTimeout(function() {')
      doc.write('      window.close();')
      doc.write('    }, 100);')
      doc.write('  }, 250);')
      doc.write('};')
      doc.write('<\/script>')

      doc.write('</body>')
      doc.write('</html>')
      doc.close()

      // Focus the window
      printWindow.focus()
    } catch (error) {
      console.error('Error generating PDF:', error)
      alert('Could not generate PDF. Please try again later.')
    }
  }
</script>

<style>
  .toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid rgb(var(--surface-border));
    background: rgb(var(--surface-section));
  }

  .tab-group {
    display: flex;
    gap: 0.5rem;
  }

  .editor-container {
    border: none !important;
    background: rgb(var(--surface-ground));
    display: flex;
    flex-direction: column;
  }

  /* PDF Preview Styles */
  .pdf-preview-container {
    overflow: auto;
  }

  .pdf-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    background: white;
    border-radius: 4px;
    overflow: visible;
    min-height: 100%;
    width: 100%;
  }

  /* Empty content message */
  .empty-content {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 16px;
    color: #666;
    text-align: center;
    padding: 20px;
  }

  /* Rich Text Editor Styles */
  .prose {
    max-width: none;
  }

  /* Ensure editor text is visible */
  :deep(.ProseMirror) {
    color: #000 !important;
  }

  :deep(.tiptap) {
    color: #000 !important;
  }

  /* Fix button styling */
  :deep(.p-button.p-button-secondary) {
    background-color: #f0f0f0 !important;
    color: #333 !important;
    border-color: #d0d0d0 !important;
  }

  :deep(.p-button.p-button-secondary:hover) {
    background-color: #e0e0e0 !important;
    border-color: #c0c0c0 !important;
  }

  :deep(.p-button.p-button-secondary .p-button-icon) {
    color: #333 !important;
  }

  /* Ensure toolbar has proper background */
  :deep(.toolbar) {
    background-color: #f5f5f5 !important;
  }
</style>
