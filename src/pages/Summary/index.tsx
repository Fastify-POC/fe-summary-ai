import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { twMerge } from 'tailwind-merge'

import Button from '../../components/button'

function Summary() {
  const [text, setText] = useState('')
  const [summary, setSummary] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const summaryChunksRef = useRef<string[]>([])
  const timeoutRef = useRef<number | null>(null)

  const handleSummarize = async () => {
    try {
      setLoading(true)
      setError('')
      setSummary('')
      summaryChunksRef.current = []

      const response = await fetch(
        `${import.meta.env.VITE_API_ENDPOINT}/ai/summary`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ text }),
        },
      )

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }

      const reader = response.body?.getReader()
      if (!reader) {
        throw new Error('Response body is not readable')
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()

        if (done) {
          if (buffer) {
            processChunk(buffer)
          }
          break
        }

        const chunk = decoder.decode(value, { stream: true })
        buffer += chunk

        const messages = buffer.split('\n\n')
        buffer = messages.pop() || ''

        if (messages.length > 0) {
          processChunk(messages.join('\n\n'))
        }
      }

      setLoading(false)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ||
            `Error: ${err.response?.status}` ||
            err.message,
        )
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Failed to get summary')
      }
      console.error('Summarize error:', err)
      setLoading(false)
    }
  }

  const processChunk = (chunk: string) => {
    const dataRegex = /data: ({.*?})/g
    let match

    while ((match = dataRegex.exec(chunk)) !== null) {
      try {
        const jsonData = JSON.parse(match[1])
        if (jsonData.text) {
          summaryChunksRef.current.push(jsonData.text)

          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
          }

          timeoutRef.current = window.setTimeout(() => {
            setSummary(summaryChunksRef.current.join(''))
          }, 50)
        }
      } catch (e) {
        console.error('Error parsing JSON:', match[1], e)
      }
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <div className="relative flex h-screen items-center justify-center bg-[#4b1044]">
      <button
        className="absolute top-10 left-10 rounded bg-[#1C1E22] px-4 py-2 text-lg font-semibold text-white shadow-lg hover:bg-[#121418]"
        onClick={() => navigate('/')}
      >
        Go to Landing
      </button>

      <div className="flex h-3/4 w-1/2 flex-col items-center gap-8 rounded-lg bg-[#1C1E22] p-8 shadow-lg">
        <p className="text-5xl font-bold text-white">
          Summarize your text here
        </p>

        <textarea
          className="h-full w-full rounded-lg border-2 border-[#4b1044] bg-[#121418] p-4 text-white"
          placeholder="Paste your text here..."
          onChange={(e) => setText(e.target.value)}
        />

        <Button
          className={twMerge(
            'rounded bg-[#4b1044] px-4 py-2 text-lg font-semibold text-white shadow-lg',
          )}
          disabled={!text}
          isLoading={loading}
          onClick={handleSummarize}
        >
          Summarize
        </Button>

        <div className="w-full overflow-y-auto rounded-lg border-2 border-[#4b1044] bg-[#121418] p-4 text-white">
          <p className="text-lg font-semibold">Summary:</p>
          {error ? (
            <p className="mt-2 text-red-400">{error}</p>
          ) : summary ? (
            <p className="mt-2">{summary}</p>
          ) : (
            <p className="mt-2">This is where the summary will appear.</p>
          )}{' '}
        </div>
      </div>
    </div>
  )
}

export default Summary
