<!-- components/PdfViewer.vue -->
<template>
  <div>
    <ClientOnly>
      <div
        v-if="loading"
        class="loading-indicator">
        <div class="spinner"/>
        <div>Generating PDF preview...</div>
      </div>
      <div
        v-else-if="error"
        class="error-message">
        {{ error }}
      </div>
      <div
        ref="canvasContainer"
        class="canvas-container min-h-[400px] border-1 border-gray-500 mt-5"
        :class="{ hidden: loading || error }"/>
    </ClientOnly>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    content: string
  }>()

  const canvasContainer = ref<HTMLElement | null>(null)
  const pageRendering = ref(false)
  const loading = ref(true)
  const error = ref<string | null>(null)
  let pdfDoc: any = null
  let pdfjsLib: any = null

  // Clean up any resources when component is unmounted
  onBeforeUnmount(() => {
    if (pdfDoc) {
      pdfDoc = null
    }
  })

  // Initialize PDF.js
  onMounted(async () => {
    if (import.meta.client) {
      try {
        pdfjsLib = initPdfJs()

        console.log('PDF Data available:', props.content)

        if (props.content && Object.keys(props.content).length > 0) {
          await generatePdf()
        } else {
          loading.value = false
          error.value = 'No data available to generate PDF.'
        }
      } catch (err) {
        console.error('Error initializing PDF.js:', err)
        error.value = 'Failed to initialize PDF viewer. Please try again.'
        loading.value = false
      }
    }
  })

  // Watch for content changes
  watch(
    () => props.content,
    async (newData) => {
      if (pdfjsLib && newData && Object.keys(newData).length > 0) {
        loading.value = true
        error.value = null
        await generatePdf()
      }
    },
    { deep: true }
  )

  // Generate PDF from content
  async function generatePdf() {
    if (!pdfjsLib || !import.meta.client) return

    try {
      console.log('1. Starting PDF generation with data:', props.content)

      // Import pdfMake dynamically
      console.log('2. Importing pdfMake modules')
      const pdfMakeModule = await import('pdfmake/build/pdfmake')
      const pdfFontsModule = await import('pdfmake/build/vfs_fonts')
      console.log('3. Modules imported successfully')

      // Get the default export or the module itself
      const pdfMake = pdfMakeModule.default || pdfMakeModule

      // Manually set up the vfs with a basic font
      if (!pdfMake.vfs) {
        // @ts-expect-error - We know this property might exist
        pdfMake.vfs = pdfFontsModule.pdfMake?.vfs || {}
      }

      // Create a temporary element to parse the HTML
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = props.content || ''

      console.log('4. Parsed HTML:', tempDiv.innerHTML)

      // Extract text content and structure
      const pdfContent = extractPdfContent(tempDiv)
      console.log('5. Extracted PDF content:', pdfContent)

      // Define the document with basic fonts
      const docDefinition = {
        content: pdfContent,
        defaultStyle: {
          font: 'Roboto',
          fontSize: 12,
          lineHeight: 1.5,
        },
        pageMargins: [40, 60, 40, 60] as [number, number, number, number],
      }

      // Generate PDF as Blob
      const pdfDocGenerator = pdfMake.createPdf(docDefinition)

      pdfDocGenerator.getBlob(async (blob: Blob) => {
        console.log('6. PDF blob generated: ', blob.size, 'bytes')
        try {
          // Convert blob to array buffer
          const arrayBuffer = await blob.arrayBuffer()
          const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer })
          pdfDoc = await loadingTask.promise
          console.log('PDF document loaded:', pdfDoc)

          await nextTick()

          console.log(
            'Canvas container before rendering:',
            canvasContainer.value
          )

          // Initial/first page rendering
          if (canvasContainer.value) {
            await renderPage(1)
          } else {
            error.value = 'Canvas container not available for rendering.'
          }
          loading.value = false
        } catch (err) {
          console.error('7. Error in blob processing:', err)
          error.value = 'Failed to process PDF data.'
          loading.value = false
        }
      })
    } catch (err) {
      console.error('Error generating PDF:', err)
      error.value = 'Failed to generate PDF preview.'
      loading.value = false
    }
  }

  // Render the specified page
  async function renderPage(num: number) {
    console.log('pdfDoc:', pdfDoc)
    console.log('canvasContainer:', canvasContainer.value)
    if (!pdfDoc || !canvasContainer.value) return

    pageRendering.value = true
    error.value = null

    try {
      console.log(`Rendering page ${num} of ${pdfDoc.numPages}`)
      // Get page
      const page = await pdfDoc.getPage(num)

      // Clear previous content
      const existingCanvas = canvasContainer.value?.querySelector(
        `.page-${num}`
      )
      if (existingCanvas) {
        existingCanvas.remove()
      }

      // Calculate scale to fit the container width
      const containerWidth = canvasContainer.value?.clientWidth || 800
      const viewport = page.getViewport({ scale: 1.0 })
      const scale = containerWidth / viewport.width
      const scaledViewport = page.getViewport({ scale })

      // Create canvas for each page
      const canvas = document.createElement('canvas')
      canvas.className = 'pdf-page'
      canvas.height = scaledViewport.height
      canvas.width = scaledViewport.width
      canvas.style.display = 'block'
      canvas.style.margin = '10px auto'

      canvasContainer.value?.appendChild(canvas)

      const ctx = canvas.getContext('2d')
      if (!ctx) {
        console.error('Failed to get canvas context')
        error.value = 'Failed to render PDF: Canvas context unavailable.'
        return
      }

      // Render PDF page into canvas context
      const renderContext = {
        canvasContext: ctx,
        viewport: scaledViewport,
      }

      console.log('Starting page render...')
      const renderTask = page.render(renderContext)
      await renderTask.promise
      console.log(`Page ${num} renderedd successfully`)

      pageRendering.value = false

      // If there are more pages, render them too
      if (num < pdfDoc.numPages) {
        renderPage(num + 1)
      }
    } catch (err) {
      console.error(`Error rendering page ${num}:`, err)
      pageRendering.value = false
      error.value = `Failed to render PDF page ${num}.`
    }
  }

  // Extract content from HTML for PDF generation
  function extractPdfContent(element: HTMLElement): any[] {
    const result: any[] = []

    // Process child nodes
    Array.from(element.childNodes).forEach((node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent?.trim() || ''
        if (text) {
          result.push({ text })
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        const elementNode = node as HTMLElement
        const nodeName = elementNode.nodeName.toLowerCase()

        // Handle different element types
        if (nodeName === 'p') {
          result.push({
            text: elementNode.textContent?.trim() || '',
            margin: [0, 5, 0, 10],
          })
        } else if (nodeName === 'h1') {
          result.push({
            text: elementNode.textContent?.trim() || '',
            fontSize: 24,
            bold: true,
            margin: [0, 10, 0, 10],
          })
        } else if (nodeName === 'h2') {
          result.push({
            text: elementNode.textContent?.trim() || '',
            fontSize: 20,
            bold: true,
            margin: [0, 10, 0, 5],
          })
        } else if (nodeName === 'h3') {
          result.push({
            text: elementNode.textContent?.trim() || '',
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
          })
        } else if (nodeName === 'ul' || nodeName === 'ol') {
          const items = Array.from(elementNode.children).map((li) => {
            return { text: li.textContent?.trim() || '', margin: [0, 2, 0, 2] }
          })

          result.push({
            ul: nodeName === 'ul' ? items : undefined,
            ol: nodeName === 'ol' ? items : undefined,
            margin: [0, 5, 0, 10],
          })
        } else if (nodeName === 'table') {
          // Extract table data
          const tableData: string[][] = []
          Array.from(elementNode.querySelectorAll('tr')).forEach((row) => {
            const rowData: string[] = []
            Array.from(row.querySelectorAll('td, th')).forEach((cell) => {
              rowData.push(cell.textContent?.trim() || '')
            })
            if (rowData.length > 0) {
              tableData.push(rowData)
            }
          })

          if (tableData.length > 0) {
            result.push({
              table: {
                body: tableData,
                widths: Array(tableData[0]?.length).fill('*'),
              },
              margin: [0, 5, 0, 10],
            })
          }
        } else {
          // Recursively process other elements
          const childContent = extractPdfContent(elementNode)
          if (childContent.length > 0) {
            result.push(...childContent)
          }
        }
      }
    })
    return result
  }
</script>
