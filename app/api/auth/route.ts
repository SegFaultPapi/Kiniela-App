import { createClient, Errors } from '@farcaster/quick-auth'
import { NextRequest, NextResponse } from 'next/server'

const domain = process.env.NEXT_PUBLIC_URL || 'https://v0-kiniela-app.vercel.app'
const client = createClient()

// This endpoint returns the authenticated user's FID 
export async function GET(request: NextRequest) {
  const authorization = request.headers.get('Authorization')
  if (!authorization?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token = authorization.split(' ')[1]

  try {
    const payload = await client.verifyJwt({ token, domain })
    
    // Log the payload for debugging (remove in production)
    console.log('JWT Payload:', {
      iat: payload.iat,
      iss: payload.iss,
      exp: payload.exp,
      sub: payload.sub, // User's Farcaster ID (FID)
      aud: payload.aud
    })
    
    return NextResponse.json({
      fid: payload.sub, // User's Farcaster ID
      displayName: `User ${payload.sub}`,
      username: `user${payload.sub}`,
      // Additional metadata from JWT
      issuedAt: payload.iat,
      expiresAt: payload.exp,
      issuer: payload.iss
    })
  } catch (e) {
    if (e instanceof Errors.InvalidTokenError) {
      console.error('Invalid token error:', e)
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
    console.error('Auth verification error:', e)
    throw e
  }
}
