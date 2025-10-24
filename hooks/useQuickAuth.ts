'use client'

import { useState, useEffect } from 'react'
import { sdk } from '@farcaster/miniapp-sdk'

interface UserData {
  fid: number
  displayName?: string
  username?: string
}

interface AuthState {
  token: string | null
  userData: UserData | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export function useQuickAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    userData: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  })

  const signIn = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const { token } = await sdk.quickAuth.getToken()
      setAuthState(prev => ({ ...prev, token, isLoading: false }))
      
      // Use the token to authenticate the user and fetch authenticated user data
      const response = await sdk.quickAuth.fetch(`${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/api/auth`, {
        headers: { "Authorization": `Bearer ${token}` }
      })
      
      if (!response.ok) {
        throw new Error('Failed to authenticate with backend')
      }
      
      const data = await response.json()
      setAuthState(prev => ({ 
        ...prev, 
        userData: data, 
        isAuthenticated: true,
        isLoading: false 
      }))
    } catch (error) {
      console.error("Authentication failed:", error)
      setAuthState(prev => ({ 
        ...prev, 
        error: error instanceof Error ? error.message : 'Authentication failed',
        isLoading: false 
      }))
    }
  }

  const signOut = () => {
    setAuthState({
      token: null,
      userData: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    })
  }

  return {
    ...authState,
    signIn,
    signOut
  }
}
