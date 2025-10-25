'use client'

import { useAccount, useDisconnect, useCapabilities, useBalance } from 'wagmi'
import React, { useEffect, useState } from 'react'
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
import { formatUnits } from 'viem'
import { useAutoConnect } from '@/hooks/useAutoConnect'

// USDC Contract Address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`

export function WalletConnection() {
  // Agregar estilos CSS para la animación de pulso
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  const { address, isConnected, isConnecting } = useAccount()
  const { disconnect } = useDisconnect()
  const [isBaseApp, setIsBaseApp] = useState(false)
  const [baseAccountCapabilities, setBaseAccountCapabilities] = useState<any>(null)
  const [isMounted, setIsMounted] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)

  // AC-002: Auto-conectar en Base App
  const { error: autoConnectError } = useAutoConnect()

  // Actualizar el error de conexión si hay uno del auto-connect
  useEffect(() => {
    if (autoConnectError) {
      setConnectionError(autoConnectError)
    }
  }, [autoConnectError])

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  })

  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address: address,
    token: USDC_ADDRESS,
  })

  // Prevent hydration mismatch
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Detectar capacidades de Base Account
  const { data: capabilities } = useCapabilities({
    account: address,
  })

  // Detectar si estamos en Base App (AC-001)
  useEffect(() => {
    if (!isMounted) return
    
    const detectBaseApp = () => {
      // Múltiples métodos de detección según KIN-001
      const isInBaseApp = typeof window !== 'undefined' && (
        // @ts-ignore - Base App ethereum provider
        window.ethereum?.isBaseApp ||
        window.location.hostname.includes('base.org') || 
        window.location.hostname.includes('base.app') ||
        window.navigator.userAgent.includes('Base') ||
        // Detectar si estamos en un iframe de Base App
        window.parent !== window
      )
      
      setIsBaseApp(isInBaseApp)
      console.log('✅ KIN-001 - Base App Detection:', {
        isInBaseApp,
        hasBaseProvider: !!(window as any).ethereum?.isBaseApp,
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

  // SECURITY: Verificar que la wallet conectada es válida
  useEffect(() => {
    if (!isMounted || !isConnected || !address) return

    // Si hay una wallet conectada sin user interaction y no estamos en Base App, desconectar
    if (!isBaseApp && isConnected && !isConnecting) {
      const userInitiated = window.sessionStorage.getItem('userConnectedWallet')
      if (!userInitiated) {
        console.warn('🔒 SECURITY: Unexpected wallet connection detected, disconnecting...')
        disconnect()
        setConnectionError('Please reconnect your wallet')
        return
      }
    }
  }, [isMounted, isConnected, isConnecting, address, isBaseApp, disconnect])

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

  // Si estamos en Base App y conectados, mostrar información de Base Account (AC-001, AC-002)
  if (isBaseApp && isConnected && baseAccountCapabilities) {
    const usdcBalanceFormatted = usdcBalance 
      ? parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)).toFixed(2)
      : '0.00'

    return (
      <div className="flex items-center gap-2">
        {/* Balance USDC - AC-001 */}
        {usdcBalance && (
          <div className="hidden sm:flex items-center gap-1 bg-gray-800/50 px-2 py-1 rounded-lg border border-gray-600/50">
            <span className="text-xs font-medium text-gray-300">${usdcBalanceFormatted}</span>
            <span className="text-xs text-gray-400">USDC</span>
          </div>
        )}
        
        <Wallet>
          <ConnectWallet>
            <div className="flex items-center gap-2 bg-gray-800/50 hover:bg-gray-700/50 px-3 py-2 rounded-lg border border-gray-600/50 transition-all duration-200 hover:border-blue-500/50">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <Avatar className="h-6 w-6" />
              <Name className="hidden sm:block" />
            </div>
          </ConnectWallet>
          <WalletDropdown>
            <Identity className="px-4 pt-3 pb-2" hasCopyAddressOnClick>
              <Avatar />
              <Name />
              <Address />
              {usdcBalance && (
                <div className="mt-2 pt-2 border-t border-gray-700">
                  <div className="text-sm text-gray-400">Balance</div>
                  <div className="text-lg font-semibold text-white">${usdcBalanceFormatted} USDC</div>
                </div>
              )}
            </Identity>
            <WalletDropdownDisconnect />
          </WalletDropdown>
        </Wallet>
      </div>
    )
  }

  // Para desarrollo fuera de Base App, mostrar botón de conexión (AC-003)
  if (!isBaseApp) {
    return (
      <Wallet>
        <ConnectWallet>
          <div 
            style={{
              backgroundColor: '#0066FF',
              color: '#FFFFFF',
              padding: '10px 20px',
              borderRadius: '8px',
              border: 'none',
              fontSize: '14px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'inline-block',
              textAlign: 'center',
              boxShadow: '0 4px 12px rgba(0, 102, 255, 0.6)',
              minHeight: 'auto',
              minWidth: 'auto',
              whiteSpace: 'nowrap',
              lineHeight: '1.5'
            }}
            onClick={() => {
              // Marcar que la conexión fue iniciada por el usuario
              if (typeof window !== 'undefined') {
                window.sessionStorage.setItem('userConnectedWallet', 'true')
              }
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#0052CC';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#0066FF';
            }}
          >
            💼 Conectar
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

  // Estado de carga cuando está conectando en Base App (AC-001: <2s loading)
  if (isConnecting) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          <div className="text-xs text-gray-300">
            Connecting wallet...
          </div>
        </div>
      </div>
    )
  }

  // Estado de error si hay problemas de conexión (AC-004)
  if (connectionError && !isConnected) {
    return (
      <div className="flex flex-col items-end gap-2">
        <div className="text-xs text-red-400 bg-red-900/20 px-3 py-2 rounded-lg">
          {connectionError}
        </div>
        <button
          onClick={() => {
            setConnectionError(null)
            window.location.reload()
          }}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-200"
        >
          Try Again
        </button>
      </div>
    )
  }

  // Fallback: mostrar botón de conexión si no está conectado
  return (
    <Wallet>
      <ConnectWallet>
        <div 
          style={{
            backgroundColor: '#0066FF',
            color: '#FFFFFF',
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'inline-block',
            textAlign: 'center',
            boxShadow: '0 4px 12px rgba(0, 102, 255, 0.6)',
            minHeight: 'auto',
            minWidth: 'auto',
            whiteSpace: 'nowrap',
            lineHeight: '1.5'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#0052CC';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#0066FF';
          }}
        >
          💼 Conectar
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
