'use client'

import { OnchainKitProviderWrapper } from '@/components/onchainkit-provider'
import { FarcasterProvider } from '@/components/farcaster-provider'

export function HybridProvider({ children }: { children: React.ReactNode }) {
  return (
    <OnchainKitProviderWrapper>
      <FarcasterProvider>
        {children}
      </FarcasterProvider>
    </OnchainKitProviderWrapper>
  )
}
