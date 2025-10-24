'use client'

import { useMiniKit, useAuthenticate } from '@coinbase/onchainkit/minikit'
import { useCapabilities, useAccount } from 'wagmi'
import { useEffect, useState } from 'react'

export function AutoWalletConnect({ children }: { children: React.ReactNode }) {
  const { user: contextUser, client } = useMiniKit()
  const { user: authenticatedUser, authenticate } = useAuthenticate()
  const account = useAccount()
  const [isConnecting, setIsConnecting] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Detectar capacidades de Base Account
  const { data: capabilities } = useCapabilities({
    account: account.address,
  })

  useEffect(() => {
    async function autoConnect() {
      try {
        // 1. Verificar si está en Base App
        if (client?.isBaseApp) {
          // Intentar autenticación criptográfica
          try {
            const authResult = await authenticate()
            if (authResult) {
              console.log('User authenticated:', authResult)
              setIsConnecting(false)
              return
            }
          } catch (authError) {
            console.log('Authentication failed, continuing with wallet connection:', authError)
          }
          
          // Si la autenticación falla, continuar con wallet connection
          setIsConnecting(false)
          return
        }

        // 2. Fallback a WalletConnect para wallets externos
        if (!account.isConnected) {
          // Mostrar opciones de conexión manual
          setError('Conecta tu wallet para continuar')
        }
        
        setIsConnecting(false)
      } catch (err) {
        setError('Error conectando wallet')
        setIsConnecting(false)
      }
    }

    autoConnect()
  }, [client, account.isConnected, authenticate])

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
