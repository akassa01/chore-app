import { NextRequest, NextResponse } from 'next/server'
import { rotateChores } from '@/lib/rotation'

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication/authorization here
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const result = await rotateChores()
    
    if (result.success) {
      return NextResponse.json({ 
        success: true, 
        message: 'Chores rotated successfully',
        assignments: result.assignments 
      })
    } else {
      return NextResponse.json({ 
        error: 'Failed to rotate chores',
        details: result.error 
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Error in rotate-chores API:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
