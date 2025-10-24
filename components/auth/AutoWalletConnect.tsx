'use client'

import { useCapabilities, useAccount } from 'wagmi'
import { useEffect, useState } from 'react'

export function AutoWalletConnect({ children }: { children: React.ReactNode }) {
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [miniKitAvailable, setMiniKitAvailable] = useState(false)

  const account = useAccount()

  // Detectar capacidades de Base Account
  const { data: capabilities } = useCapabilities({
    account: account.address,
  })

  useEffect(() => {
    async function autoConnect() {
      try {
        // Check if we're in a Base App environment by checking for Base-specific APIs
        const isBaseApp = typeof window !== 'undefined' && 
          (window.location.hostname.includes('base.org') || 
           window.location.hostname.includes('base.app') ||
           window.navigator.userAgent.includes('Base'))

        if (isBaseApp) {
          console.log('Base App environment detected')
          // In Base App, wallet should be automatically connected
          setIsConnecting(false)
          return
        }

        // For non-Base environments, check if wallet is connected
        if (!account.isConnected) {
          setError('Conecta tu wallet para continuar')
        }

        setIsConnecting(false)
      } catch (err) {
        console.log('Auto-connection error:', err)
        setError('Error conectando wallet')
        setIsConnecting(false)
      }
    }

    autoConnect()
  }, [account.isConnected])

  // Loading state
  if (isConnecting) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-2">Conectando wallet...</span>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded"
          onClick={() => window.location.reload()}
        >
          Reintentar
        </button>
      </div>
    )
  }

  // Success: renderizar app
  return <>{children}</>
}
