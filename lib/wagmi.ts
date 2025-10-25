import { createConfig, http } from 'wagmi'
import { base, baseSepolia } from 'wagmi/chains'
import { coinbaseWallet } from 'wagmi/connectors'

export const config = createConfig({
  chains: [base, baseSepolia],
  connectors: [
    coinbaseWallet({
      appName: 'Kiniela',
      appLogoUrl: '/kiniela_logo.png',
      preference: 'smartWalletOnly',
      version: '4',
    }),
  ],
  transports: {
    [base.id]: http(),
    [baseSepolia.id]: http(),
  },
  // AC-002: Persistencia de conexión entre sesiones
  ssr: true, // Enable server-side rendering support
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
