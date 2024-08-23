import { useState } from 'react'

export default function useGeneratePdf() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const generatePdf = async ({
    payload,
    fileName,
  }: {
    payload: any
    fileName: string
  }) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${fileName}.pdf`
      document.body.appendChild(a)
      a.click()
      a.remove()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      if (error instanceof Error) setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return { generatePdf, loading, error }
}
