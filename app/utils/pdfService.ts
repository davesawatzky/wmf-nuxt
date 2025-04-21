import * as pdfjsLib from 'pdfjs-dist'

// Only initialize in browser context
export function initPdfJs() {
  if (import.meta.client) {
    // Set the worker source path
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.mjs',
      import.meta.url
    ).toString()

    return pdfjsLib
  }
  return null
}
