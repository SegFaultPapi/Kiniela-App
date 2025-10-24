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

  // Detectar capacidades de Base Account
  const { data: capabilities } = useCapabilities({
    account: address,
  })

  // Detectar si estamos en Base App
  useEffect(() => {
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
  }, [])

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
  }, [isConnected, isConnecting, address, isBaseApp, baseAccountCapabilities])

  // Si estamos en Base App y conectados, mostrar información de Base Account
  if (isBaseApp && isConnected && baseAccountCapabilities) {
    return (
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <div className="text-sm text-gray-300">
            Base Account Connected
          </div>
        </div>
        <Wallet>
          <ConnectWallet>
            <div className="flex items-center gap-2">
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
      </div>
    )
  }

  // Para desarrollo fuera de Base App, mostrar botón de conexión
  if (!isBaseApp) {
    return (
      <div className="flex items-center gap-4">
        <div className="text-sm text-yellow-400">
          ⚠️ Ejecutándose fuera de Base App
        </div>
        <Wallet>
          <ConnectWallet>
            <div className="flex items-center gap-2">
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
      </div>
    )
  }

  // Estado de carga cuando está conectando en Base App
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        <div className="text-sm text-gray-300">
          Conectando Base Account...
        </div>
      </div>
    </div>
  )
}
