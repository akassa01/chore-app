import { NextRequest, NextResponse } from 'next/server'
import { markLateChores } from '@/lib/rotation'

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await markLateChores()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Late chores marked successfully'
      })
    } else {
      return NextResponse.json({ 
        error: 'Failed to mark late chores',
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in mark-late API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
