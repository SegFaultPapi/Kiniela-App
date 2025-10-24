'use client'

import { useOnchainKit } from '@coinbase/onchainkit'
import { useAccount, useDisconnect } from 'wagmi'

export function WalletConnection() {
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  const { open } = useOnchainKit()

  return (
    <div className="flex items-center gap-4">
      {isConnected ? (
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-300">
            {address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'Connected'}
          </div>
          <button
            onClick={() => disconnect()}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-500 transition-colors"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={open}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
        >
          Connect Wallet
        </button>
      )}
    </div>
  )
}
