import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    version: '1.1.0',
    timestamp: new Date().toISOString(),
    features: {
      proxy: true,
      robustExtraction: true,
      debugPanel: true
    }
  })
}