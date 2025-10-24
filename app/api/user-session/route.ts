import { NextRequest, NextResponse } from 'next/server'

interface UserSession {
  fid: number
  address?: string
  signature?: string
  message?: string
  timestamp: number
}

// In a real application, you would save this to a database
// For now, we'll just log it and return success
const userSessions: UserSession[] = []

export async function POST(request: NextRequest) {
  try {
    const userSession: UserSession = await request.json()
    
    // Validate required fields
    if (!userSession.fid || !userSession.timestamp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // In a real app, you would:
    // 1. Verify the signature server-side
    // 2. Check if the FID is valid
    // 3. Save to database
    // 4. Create a session token
    
    // For now, just store in memory (will be lost on restart)
    userSessions.push(userSession)
    
    console.log('User session saved:', {
      fid: userSession.fid,
      address: userSession.address,
      timestamp: new Date(userSession.timestamp).toISOString()
    })

    return NextResponse.json({
      success: true,
      message: 'User session saved successfully',
      fid: userSession.fid,
      sessionId: `session_${userSession.fid}_${userSession.timestamp}`
    })
  } catch (error) {
    console.error('Error saving user session:', error)
    return NextResponse.json({ error: 'Failed to save user session' }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    // Return all user sessions (for debugging)
    return NextResponse.json({
      sessions: userSessions,
      count: userSessions.length
    })
  } catch (error) {
    console.error('Error fetching user sessions:', error)
    return NextResponse.json({ error: 'Failed to fetch user sessions' }, { status: 500 })
  }
}
