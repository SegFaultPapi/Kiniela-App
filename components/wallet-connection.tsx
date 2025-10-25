'use client'

import { useAccount, useDisconnect, useCapabilities, useBalance } from 'wagmi'
import { base } from 'wagmi/chains'
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
import { useEnsName } from 'wagmi'

// USDC Contract Address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`

// Utility function to format address
function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

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

  // Get USDC balance - AC-002: Balance actualizado en tiempo real
  const { data: usdcBalance } = useBalance({
    address: address,
    token: USDC_ADDRESS,
    query: {
      refetchInterval: 10000, // Actualizar cada 10 segundos
      enabled: !!address && isConnected, // Solo consultar si está conectado
    }
  })

  // Get ENS name for the connected address
  const { data: ensName } = useEnsName({
    address: address,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    }
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
      // Detección más agresiva para Base App
      const isInBaseApp = typeof window !== 'undefined' && (
        // @ts-ignore - Base App ethereum provider
        window.ethereum?.isBaseApp ||
        // Detectar por hostname (más específico)
        window.location.hostname.includes('base.org') || 
        window.location.hostname.includes('base.app') ||
        window.location.hostname.includes('base.dev') ||
        // Detectar por user agent
        window.navigator.userAgent.includes('Base') ||
        // Detectar si estamos en un iframe (Base App usa iframes)
        window.parent !== window ||
        // Detectar por referrer
        document.referrer.includes('base.org') ||
        document.referrer.includes('base.app') ||
        document.referrer.includes('base.dev') ||
        // Detectar por URL parameters
        window.location.search.includes('base') ||
        // Detectar por localStorage/sessionStorage
        window.localStorage.getItem('baseApp') === 'true' ||
        window.sessionStorage.getItem('baseApp') === 'true' ||
        // Detectar por window.name (Base App puede usar esto)
        window.name.includes('base') ||
        // Detectar por document.title
        document.title.includes('Base') ||
        // Detectar por window.location.origin
        window.location.origin.includes('base')
      )
      
      setIsBaseApp(isInBaseApp)
      console.log('✅ KIN-001 - Base App Detection:', {
        isInBaseApp,
        hasBaseProvider: !!(window as any).ethereum?.isBaseApp,
        hostname: window.location.hostname,
        origin: window.location.origin,
        userAgent: window.navigator.userAgent,
        isIframe: window.parent !== window,
        referrer: document.referrer,
        search: window.location.search,
        windowName: window.name,
        documentTitle: document.title,
        localStorage: window.localStorage.getItem('baseApp'),
        sessionStorage: window.sessionStorage.getItem('baseApp'),
        ethereum: window.ethereum ? Object.keys(window.ethereum) : 'No ethereum'
      })
    }

    detectBaseApp()
    
    // Re-detectar cada 2 segundos para capturar cambios dinámicos
    const interval = setInterval(detectBaseApp, 2000)
    return () => clearInterval(interval)
  }, [isMounted])

  // Detectar capacidades de Base Account (Smart Wallet)
  useEffect(() => {
    if (capabilities) {
      setBaseAccountCapabilities(capabilities)
      
      // Verificar si es una Smart Wallet
      const isSmartWallet = Object.keys(capabilities).length > 0
      const hasAtomicBatch = capabilities[base.id]?.atomicBatch?.supported
      const hasPaymaster = capabilities[base.id]?.paymasterService?.supported
      
      console.log('🔧 Base Account Capabilities:', {
        capabilities,
        isSmartWallet,
        hasAtomicBatch,
        hasPaymaster,
        chainId: base.id,
        timestamp: new Date().toISOString()
      })
      
      if (isSmartWallet) {
        console.log('✅ Smart Wallet detectada correctamente!')
      }
    }
  }, [capabilities])

  // SECURITY: Verificar que la wallet conectada es válida (SOLO en primera conexión)
  useEffect(() => {
    if (!isMounted || !isConnected || !address) return

    // Solo verificar en la primera conexión, no en cada cambio de página
    const hasVerified = window.sessionStorage.getItem('walletVerified')
    if (hasVerified) return // Ya verificamos esta sesión
    
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
    
    // Marcar que ya verificamos esta conexión
    window.sessionStorage.setItem('walletVerified', 'true')
  }, [isMounted, isConnected, isConnecting, address, isBaseApp, disconnect])

  // Logs para verificar el estado de conexión y tipo de wallet
  useEffect(() => {
    if (!isMounted) return
    
    const walletType = baseAccountCapabilities ? 'Smart Wallet' : 'EOA/Regular Wallet'
    const isSmartWallet = baseAccountCapabilities && Object.keys(baseAccountCapabilities).length > 0
    
    console.log('🔗 Base App Wallet Status:', {
      isConnected,
      isConnecting,
      address: address ? `${address.slice(0, 6)}...${address.slice(-4)}` : 'No address',
      isBaseApp,
      walletType,
      isSmartWallet,
      hasBaseAccountCapabilities: !!baseAccountCapabilities,
      capabilitiesCount: baseAccountCapabilities ? Object.keys(baseAccountCapabilities).length : 0,
      timestamp: new Date().toISOString()
    })

    // Debug OnchainKit components
    if (isConnected && address) {
      console.log('🔍 OnchainKit Debug Info:', {
        address,
        addressFormatted: formatAddress(address),
        ensName,
        hasNameComponent: true, // Name component should work
        hasAddressComponent: true, // Address component should work
        hasAvatarComponent: true, // Avatar component should work
        walletProvider: 'Base App Smart Wallet',
        timestamp: new Date().toISOString()
      })
    }

    if (isConnected && address) {
      console.log(`✅ ${walletType} conectada:`, {
        address,
        network: 'Base Network',
        walletType: isSmartWallet ? 'Base Smart Wallet (Account Abstraction)' : 'Regular Wallet (EOA)',
        capabilities: baseAccountCapabilities,
        autoConnected: isBaseApp,
        features: {
          atomicBatch: baseAccountCapabilities?.[base.id]?.atomicBatch?.supported || false,
          paymasterService: baseAccountCapabilities?.[base.id]?.paymasterService?.supported || false,
        },
        timestamp: new Date().toISOString()
      })
    } else if (!isConnected && !isConnecting) {
      console.log('❌ Wallet desconectada')
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
    
    const isSmartWallet = Object.keys(baseAccountCapabilities).length > 0

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
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title={isSmartWallet ? "Smart Wallet conectada" : "Wallet conectada"}></div>
              <Avatar className="h-6 w-6" />
              <div className="hidden sm:block text-sm font-medium text-white">
                <Name />
                {/* Fallback manual con ENS name */}
                {!ensName && address && (
                  <span className="text-gray-300">{formatAddress(address)}</span>
                )}
                {ensName && (
                  <span className="text-blue-400">{ensName}</span>
                )}
              </div>
              {isSmartWallet && (
                <span className="hidden md:inline text-xs text-blue-400 font-medium" title="Smart Wallet con Account Abstraction">⚡</span>
              )}
            </div>
          </ConnectWallet>
          <WalletDropdown>
            <div className="px-4 pt-3 pb-2">
              <Identity hasCopyAddressOnClick>
                <div className="flex items-center gap-3 mb-3">
                  <Avatar className="h-10 w-10" />
                  <div className="flex-1">
                    <div className="text-lg font-semibold text-white">
                      <Name />
                      {/* ENS name fallback */}
                      {ensName && (
                        <div className="text-sm text-blue-400 mt-1">
                          {ensName}
                        </div>
                      )}
                      {/* Address fallback */}
                      {!ensName && address && (
                        <div className="text-sm text-gray-300 mt-1">
                          {formatAddress(address)}
                        </div>
                      )}
                    </div>
                    <div className="text-sm text-gray-400 font-mono">
                      <Address />
                      {/* Full address fallback */}
                      {address && (
                        <div className="text-xs text-gray-500 mt-1">
                          {address}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {isSmartWallet && (
                  <div className="mb-3 p-2 bg-blue-600/10 border border-blue-600/30 rounded-lg">
                    <div className="flex items-center gap-2 text-sm text-blue-400">
                      <span>⚡</span>
                      <span className="font-medium">Smart Wallet</span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">Account Abstraction habilitado</div>
                  </div>
                )}
                
                {usdcBalance && (
                  <div className="mb-3 p-2 bg-gray-800/50 rounded-lg">
                    <div className="text-sm text-gray-400">Balance</div>
                    <div className="text-lg font-semibold text-white">${usdcBalanceFormatted} USDC</div>
                  </div>
                )}
              </Identity>
            </div>
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
