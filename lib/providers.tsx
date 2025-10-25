'use client'

import { OnchainKitProvider } from '@coinbase/onchainkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'
import { config } from '@/lib/wagmi'
import { base } from 'wagmi/chains'
import { useState } from 'react'

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
      <WagmiProvider config={config}>
        <OnchainKitProvider 
          apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY} 
          chain={base}
        >
          {children}
        </OnchainKitProvider>
      </WagmiProvider>
    </QueryClientProvider>
  )
}
