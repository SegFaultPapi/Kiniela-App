import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Kiniela',
      appLogoUrl: '/icon.png',
      preference: 'smartWalletOnly', // Priorizar Smart Wallets de Base
      version: '4', // Usar versión 4 del SDK para Smart Wallets
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  // AC-002: Persistencia de conexión entre sesiones
  ssr: true, // Enable server-side rendering support
  storage: typeof window !== 'undefined' ? window.localStorage : undefined,
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
