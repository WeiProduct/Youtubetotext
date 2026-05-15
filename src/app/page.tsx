'use client'

import { useState } from 'react'
import ManualSubtitleInput from '@/components/ManualSubtitleInput'
import TranscriptDisplay from '@/components/TranscriptDisplay'
import URLInput from '@/components/URLInput'

interface TranscriptApiResponse {
  transcript?: string
  error?: string
}

const features = [
  {
    title: 'Caption-first extraction',
    description: 'Uses available YouTube captions and fallback methods to return clean transcript text.'
  },
  {
    title: 'Built for reuse',
    description: 'Copy the result into notes, research docs, briefs, study material, or summaries.'
  },
  {
    title: 'Manual fallback',
    description: 'If a video blocks automatic captions, paste a subtitle file URL and keep working.'
  }
]

export default function Home() {
  const [transcript, setTranscript] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [videoUrl, setVideoUrl] = useState('')

  const handleExtractTranscript = async (url: string) => {
    setLoading(true)
    setError('')
    setVideoUrl(url)
    setTranscript('')

    const controller = new AbortController()
    const timeoutId = window.setTimeout(() => controller.abort(), 35000)

    try {
      const response = await fetch('/api/youtube-transcript', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
        signal: controller.signal
      })

      const data = await response.json() as TranscriptApiResponse

      if (!response.ok) {
        throw new Error(data.error || 'Unable to extract a transcript for this video.')
      }

      if (!data.transcript) {
        throw new Error('No transcript data was returned. Try another video with captions enabled.')
      }

      setTranscript(data.transcript)
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('The request took too long. Please try again or use the manual subtitle option.')
      } else if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('Something went wrong while extracting the transcript.')
      }
    } finally {
      window.clearTimeout(timeoutId)
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.35),transparent_34%),radial-gradient(circle_at_80%_20%,rgba(20,184,166,0.22),transparent_28%),linear-gradient(135deg,#020617,#0f172a_55%,#111827)]" />
        <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 py-6 sm:px-8 lg:px-10">
          <nav className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-sm font-black text-slate-950">
                YT
              </span>
              <span className="text-sm font-semibold tracking-wide text-slate-200">YouTube to Text</span>
            </div>
            <a
              href="https://github.com/WeiProduct"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/15 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-white/35 hover:bg-white/10"
            >
              WeiProduct
            </a>
          </nav>

          <div className="grid flex-1 items-center gap-12 py-16 lg:grid-cols-[1fr_0.92fr]">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-300">AI workflow utility</p>
              <h1 className="mt-5 max-w-3xl text-5xl font-black leading-[0.95] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Convert YouTube videos into clean text transcripts.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
                Paste a video link, extract available captions, then copy or download the result for research,
                study notes, content review, or AI summarization.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {features.map((feature) => (
                  <article key={feature.title} className="rounded-xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur">
                    <h2 className="text-sm font-bold text-white">{feature.title}</h2>
                    <p className="mt-2 text-sm leading-6 text-slate-300">{feature.description}</p>
                  </article>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/12 bg-white/[0.08] p-5 shadow-2xl shadow-blue-950/30 backdrop-blur-xl sm:p-7">
              <div className="mb-6">
                <p className="text-sm font-semibold text-cyan-200">Transcript extractor</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Start with a YouTube URL</h2>
              </div>

              <URLInput onSubmit={handleExtractTranscript} loading={loading} />

              {loading && (
                <div className="mt-7 rounded-xl border border-blue-300/20 bg-blue-400/10 p-5">
                  <div className="flex items-center gap-3">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-200 border-t-transparent" />
                    <p className="text-sm font-semibold text-blue-100">Extracting transcript...</p>
                  </div>
                  <p className="mt-2 text-sm text-slate-300">Some videos take longer if captions need fallback extraction.</p>
                </div>
              )}

              {error && !loading && (
                <div className="mt-7 rounded-xl border border-red-300/25 bg-red-500/10 p-5">
                  <p className="font-semibold text-red-100">Transcript unavailable</p>
                  <p className="mt-2 text-sm leading-6 text-red-100/80">{error}</p>
                  <div className="mt-4 text-sm text-red-50">
                    <ManualSubtitleInput onSubmit={(text) => {
                      setTranscript(text)
                      setError('')
                    }} />
                  </div>
                </div>
              )}

              <p className="mt-6 text-xs leading-5 text-slate-400">
                Works best with videos that have captions or subtitles enabled. Private, restricted, or captionless videos may not return a transcript.
              </p>
            </div>
          </div>
        </div>
      </section>

      {transcript && !loading && (
        <section className="bg-slate-50 px-5 py-12 text-slate-950 sm:px-8 lg:px-10">
          <div className="mx-auto max-w-6xl">
            <TranscriptDisplay transcript={transcript} videoUrl={videoUrl} />
          </div>
        </section>
      )}
    </main>
  )
}
