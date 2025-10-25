'use client'

import { useAccount, useDisconnect, useCapabilities } from 'wagmi'
import { useEffect, useState } from 'react'
import { 
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from '@coinbase/onchainkit/wallet'
import {
  Address,
  Avatar,
  Name,
  Identity,
} from '@coinbase/onchainkit/identity'

export function WalletConnection() {
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const [isBaseApp, setIsBaseApp] = useState(false)
  const [baseAccountCapabilities, setBaseAccountCapabilities] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Detectar capacidades de Base Account
  const { data: capabilities } = useCapabilities({
    account: address,
  })

  // Detectar si estamos en Base App
  useEffect(() => {
    if (!isMounted) return
    
    const detectBaseApp = () => {
      const isInBaseApp = typeof window !== 'undefined' && 
        (window.location.hostname.includes('base.org') || 
         window.location.hostname.includes('base.app') ||
         window.navigator.userAgent.includes('Base') ||
         // Detectar si estamos en un iframe de Base App
         window.parent !== window)
      
      setIsBaseApp(isInBaseApp)
      console.log('🏠 Base App Environment:', {
        isInBaseApp,
        hostname: window.location.hostname,
        userAgent: window.navigator.userAgent,
        isIframe: window.parent !== window
      })
    }

    detectBaseApp()
  }, [isMounted])

  // Detectar capacidades de Base Account
  useEffect(() => {
    if (capabilities) {
      setBaseAccountCapabilities(capabilities)
      console.log('🔧 Base Account Capabilities:', {
        capabilities,
        timestamp: new Date().toISOString()
      })
    }
  }, [capabilities])

  // Logs para verificar el estado de conexión
  useEffect(() => {
    if (!isMounted) return
    
    console.log('🔗 Base App Wallet Status:', {
      isConnected,
      isConnecting,
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No address',
      isBaseApp,
      hasBaseAccountCapabilities: !!baseAccountCapabilities,
      timestamp: new Date().toISOString()
    })

    if (isConnected && address) {
      console.log('✅ Base Account conectado:', {
        address,
        network: 'Base Network',
        walletType: 'Base Account (Smart Wallet)',
        capabilities: baseAccountCapabilities,
        autoConnected: isBaseApp,
        timestamp: new Date().toISOString()
      })
    } else if (!isConnected && !isConnecting) {
      console.log('❌ Base Account desconectado')
    }
  }, [isConnected, isConnecting, address, isBaseApp, baseAccountCapabilities, isMounted])

  // Prevent hydration mismatch by not rendering until mounted
  if (!isMounted) {
    return (
      <div className="flex items-center gap-2">
        <div className="w-16 h-8 bg-gray-700 rounded animate-pulse"></div>
      </div>
    )
  }

  // Si estamos en Base App y conectados, mostrar información de Base Account
  if (isBaseApp && isConnected && baseAccountCapabilities) {
    return (
      <Wallet>
        <ConnectWallet>
          <div className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600/50 transition-all duration-200 hover:border-blue-500/50">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <Avatar className="h-6 w-6" />
            <Name />
          </div>
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    )
  }

  // Para desarrollo fuera de Base App, mostrar botón de conexión
  if (!isBaseApp) {
    return (
      <Wallet>
        <ConnectWallet>
          <button className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-blue-500/25 hover:scale-105">
            <div className="w-4 h-4 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            Connect Wallet
          </button>
        </ConnectWallet>
        <WalletDropdown>
          <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
            <Avatar />
            <Name />
            <Address />
          </Identity>
          <WalletDropdownDisconnect />
        </WalletDropdown>
      </Wallet>
    )
  }

  // Estado de carga cuando está conectando en Base App
  return (
    <div className="flex items-center gap-2">
      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
      <div className="text-xs text-gray-300">
        Connecting...
      </div>
    </div>
  )
}
