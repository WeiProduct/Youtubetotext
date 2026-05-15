import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { DebugProvider } from '@/lib/debug-context'
import DebugPanel from '@/components/DebugPanel'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YouTube to Text | Transcript Extractor',
  description: 'Extract clean text transcripts from YouTube videos for notes, research, and AI workflows.',
  openGraph: {
    title: 'YouTube to Text | Transcript Extractor',
    description: 'Extract clean text transcripts from YouTube videos for notes, research, and AI workflows.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'YouTube to Text | Transcript Extractor',
    description: 'Extract clean text transcripts from YouTube videos for notes, research, and AI workflows.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DebugProvider>
          {children}
          <DebugPanel />
        </DebugProvider>
      </body>
    </html>
  )
}
