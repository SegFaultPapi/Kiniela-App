'use client'

import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect, useState } from 'react'

export function FarcasterProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Call ready() as soon as possible to hide loading splash screen
    sdk.actions.ready()
    setIsReady(true)
    
    // Optional: Log when the app is ready for debugging
    console.log('Kiniela App ready for Farcaster Mini App')
  }, [])

  return <>{children}</>
}

// Hook para usar funcionalidades de Farcaster SDK
export function useFarcasterSDK() {
  const [user, setUser] = useState<{ displayName?: string; fid?: number } | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    // Obtener información del usuario si está disponible
    const getUser = async () => {
      try {
        const userData = await sdk.actions.getUser()
        if (userData) {
          setUser(userData)
          setIsConnected(true)
        }
      } catch (error) {
        console.log('No user connected or error getting user:', error)
      }
    }

    getUser()
  }, [])

  return {
    user,
    isConnected,
    sdk
  }
}