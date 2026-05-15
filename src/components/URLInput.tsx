'use client'

import { useState } from 'react'

interface URLInputProps {
  onSubmit: (url: string) => void
  loading: boolean
}

export default function URLInput({ onSubmit, loading }: URLInputProps) {
  const [url, setUrl] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (url.trim()) {
      onSubmit(url.trim())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          id="youtube-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste YouTube URL here (e.g., https://www.youtube.com/watch?v=...)"
          aria-label="YouTube video URL"
          className="flex-1 rounded-xl border border-white/15 bg-white px-4 py-3 text-slate-950
                     placeholder-slate-400 shadow-sm outline-none transition
                     focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/20"
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !url.trim()}
          className="rounded-xl bg-cyan-300 px-8 py-3 font-bold text-slate-950
                     shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-200
                     focus:outline-none focus:ring-4 focus:ring-cyan-300/30
                     disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-200"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Processing...
            </span>
          ) : (
            'Extract Text'
          )}
        </button>
      </div>
      <p className="mt-3 text-sm text-slate-300">
        Supports youtube.com and youtu.be URLs
      </p>
    </form>
  )
}
