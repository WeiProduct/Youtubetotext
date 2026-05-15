'use client'

import { useState } from 'react'

interface TranscriptDisplayProps {
  transcript: string
  videoUrl: string
}

export default function TranscriptDisplay({ transcript, videoUrl }: TranscriptDisplayProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(transcript)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([transcript], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `youtube-transcript-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-3xl font-black text-slate-950">
          Transcript
        </h2>
        <div className="flex gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 rounded-lg bg-slate-800 px-4 py-2 font-semibold text-white
                     transition-colors duration-200 hover:bg-slate-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            {copied ? 'Copied!' : 'Copy'}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white
                     transition-colors duration-200 hover:bg-emerald-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download
          </button>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-200/70 sm:p-6">
        <div className="mb-4 border-b border-slate-200 pb-4">
          <p className="break-all text-sm text-slate-500">
            Source: <a href={videoUrl} target="_blank" rel="noopener noreferrer" 
                      className="font-semibold text-blue-600 hover:underline">
              {videoUrl}
            </a>
          </p>
        </div>
        <div className="max-h-[70vh] overflow-y-auto rounded-xl bg-slate-50 p-4">
          <pre className="whitespace-pre-wrap break-words text-sm leading-7 text-slate-700 sm:text-base">
            {transcript}
          </pre>
        </div>
      </div>
    </div>
  )
}
