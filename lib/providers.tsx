'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider, useAccount, useReconnect } from 'wagmi'
import { config } from '@/lib/wagmi'
import { base } from 'wagmi/chains'
import { useState, useEffect } from 'react'

// Componente interno para manejar reconexión automática
function ReconnectHandler({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount()
  const { reconnect } = useReconnect()
  const [hasAttemptedReconnect, setHasAttemptedReconnect] = useState(false)

  useEffect(() => {
    // Intentar reconectar automáticamente si hay datos en localStorage
    if (!isConnected && !hasAttemptedReconnect) {
      const wagmiStore = localStorage.getItem('wagmi.store')
      if (wagmiStore) {
        console.log('🔄 Attempting to reconnect wallet from cache...')
        try {
          reconnect()
        } catch (error) {
          console.log('⚠️ Reconnect failed:', error)
        }
        setHasAttemptedReconnect(true)
      }
    }
  }, [isConnected, hasAttemptedReconnect, reconnect])

  return <>{children}</>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true, // AC-002: Refrescar al volver a la app
        refetchInterval: 30000, // Actualizar datos cada 30 segundos
      },
    },
  }))

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={config} reconnectOnMount={true}>
        <ReconnectHandler>
          <OnchainKitProvider 
            apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} 
            chain={base}
            ensAddress="0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
            ensUniversalResolverAddress="0x8cab227b1162f03b8338331adaad7aadc83b895e"
          >
            {children}
          </OnchainKitProvider>
        </ReconnectHandler>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
