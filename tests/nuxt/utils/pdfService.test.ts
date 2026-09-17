import { describe, expect, it } from 'vitest'
import { initPdfJs } from '../../../app/utils/pdfService'

describe('initPdfJs', () => {
  it('returns the pdfjs-dist module and configures the worker source in a client context', () => {
    const result = initPdfJs()
    expect(result).not.toBeNull()
    expect(result?.GlobalWorkerOptions.workerSrc).toBeTruthy()
  })
})
