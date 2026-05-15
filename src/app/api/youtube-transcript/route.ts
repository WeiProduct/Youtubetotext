import { NextRequest, NextResponse } from 'next/server'
import { extractVideoId, getYouTubeTranscript } from '@/lib/youtube-transcript'

interface DebugInfo {
  timestamp: string
  steps: Array<Record<string, unknown>>
  error?: string
  errorStack?: string
  duration?: number
}

const includeDebugResponse = process.env.NODE_ENV !== 'production' || process.env.NEXT_PUBLIC_DEBUG_MODE === 'true'

export async function POST(request: NextRequest) {
  const startTime = Date.now()
  const debugInfo: DebugInfo = {
    timestamp: new Date().toISOString(),
    steps: []
  }
  let videoId: string | null = null

  try {
    const { url, includeTimestamps } = await request.json()
    debugInfo.steps.push({ step: 'Parse request', url, includeTimestamps })
    
    if (!url) {
      debugInfo.error = 'YouTube URL is required'
      return NextResponse.json(
        { error: 'YouTube URL is required', ...(includeDebugResponse ? { debug: debugInfo } : {}) },
        { status: 400 }
      )
    }

    // Extract video ID from YouTube URL
    videoId = extractVideoId(url)
    debugInfo.steps.push({ step: 'Extract video ID', videoId })
    
    if (!videoId) {
      debugInfo.error = 'Invalid YouTube URL'
      return NextResponse.json(
        { error: 'Invalid YouTube URL', ...(includeDebugResponse ? { debug: debugInfo } : {}) },
        { status: 400 }
      )
    }

    // Get transcript using our utility function
    debugInfo.steps.push({ step: 'Starting transcript extraction', method: 'getYouTubeTranscript' })
    const transcriptResult = await getYouTubeTranscript(videoId, includeTimestamps || false)
    
    debugInfo.steps.push({ 
      step: 'Transcript extracted', 
      textLength: transcriptResult.text.length,
      hasSegments: !!transcriptResult.segments,
      language: transcriptResult.language
    })
    
    debugInfo.duration = Date.now() - startTime
    
    return NextResponse.json({
      success: true,
      videoId,
      transcript: transcriptResult.text,
      segments: transcriptResult.segments,
      url,
      ...(includeDebugResponse ? { debug: debugInfo } : {})
    })
  } catch (error) {
    console.error('Error processing YouTube URL:', error)
    debugInfo.error = error instanceof Error ? error.message : 'Failed to extract transcript'
    debugInfo.errorStack = error instanceof Error ? error.stack : undefined
    debugInfo.duration = Date.now() - startTime
    
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to extract transcript',
        videoId: videoId || undefined,
        ...(includeDebugResponse ? { debug: debugInfo } : {})
      },
      { status: 500 }
    )
  }
}

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
