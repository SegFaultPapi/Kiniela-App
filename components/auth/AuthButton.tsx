'use client'

import { useState } from 'react'

async function saveUserSession(authenticatedUser: any) {
  try {
    const response = await fetch('/api/user-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fid: authenticatedUser.fid,
        address: authenticatedUser.address,
        signature: authenticatedUser.signature,
        message: authenticatedUser.message,
        timestamp: Date.now()
      })
    })

    if (!response.ok) {
      throw new Error('Failed to save user session')
    }

    const result = await response.json()
    console.log('User session saved:', result)
    return result
  } catch (error) {
    console.error('Error saving user session:', error)
    throw error
  }
}

export default function AuthButton() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)
  const [user, setUser] = useState<any>(null)

  const handleAuth = async () => {
    setIsAuthenticating(true)
    try {
      // Simulate authentication for demo purposes
      // In a real Base App environment, this would use MiniKit
      const mockUser = {
        fid: 12345,
        address: '0x1234567890123456789012345678901234567890',
        signature: 'mock-signature',
        message: 'mock-message'
      }
      
      console.log('Mock authenticated user:', mockUser.fid)
      setUser(mockUser)
      await saveUserSession(mockUser)
    } catch (error) {
      console.error('Authentication failed:', error)
    } finally {
      setIsAuthenticating(false)
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">✓</span>
          </div>
          <div>
            <p className="text-green-800 font-medium">
              ✅ Authenticated as FID: {user.fid}
            </p>
            <p className="text-green-600 text-sm">
              Address: {user.address ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : 'N/A'}
            </p>
          </div>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
        >
          Sign Out
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <p className="text-yellow-800 font-medium">
          ⚠️ Demo Mode
        </p>
        <p className="text-yellow-700 text-sm mt-1">
          This is a demo version. In a Base App environment, this would use MiniKit for real Farcaster authentication.
        </p>
      </div>
      
      <button 
        onClick={handleAuth}
        disabled={isAuthenticating}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAuthenticating ? (
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Authenticating...
          </div>
        ) : (
          'Sign In with Farcaster (Demo)'
        )}
      </button>
    </div>
  )
}
