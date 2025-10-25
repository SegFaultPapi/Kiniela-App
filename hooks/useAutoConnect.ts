'use client'

import { useEffect, useRef, useState } from 'react'
import { useConnect, useAccount } from 'wagmi'

/**
 * Hook para auto-conectar wallet en Base App (KIN-001 AC-002, AC-004)
 * Zero-click wallet connection en Base App environment
 * Con retry mechanism y manejo de errores
 */
export function useAutoConnect() {
  const { connect, connectors } = useConnect()
  const { isConnected } = useAccount()
  const hasAttemptedConnection = useRef(false)
  const retryCount = useRef(0)
  const [error, setError] = useState<string | null>(null)
  const MAX_RETRIES = 3
  const RETRY_DELAY = 2000 // 2 segundos

  useEffect(() => {
    // Solo intentar conectar una vez exitosamente
    if (isConnected) {
      hasAttemptedConnection.current = false
      retryCount.current = 0
      setError(null)
      return
    }

    // Si ya intentamos y fallamos todas las veces, no reintentar
    if (hasAttemptedConnection.current && retryCount.current >= MAX_RETRIES) {
      return
    }

    // Detectar si estamos en Base App
    const isBaseApp = typeof window !== 'undefined' && (
      // @ts-ignore - Base App ethereum provider
      window.ethereum?.isBaseApp ||
      window.location.hostname.includes('base.org') || 
      window.location.hostname.includes('base.app') ||
      window.navigator.userAgent.includes('Base')
    )

    if (!isBaseApp) {
      console.log('🔗 KIN-001 AC-002: Not in Base App, skipping auto-connect')
      
      // SECURITY: En desarrollo, limpiar cualquier conexión cacheada al iniciar
      if (typeof window !== 'undefined' && window.localStorage) {
        const recentReloads = window.sessionStorage.getItem('reloadCount')
        if (!recentReloads) {
          console.log('🔒 SECURITY: Cleaning cached connections on first load')
          const wagmiKeys = Object.keys(window.localStorage).filter(key => 
            key.startsWith('wagmi.') || key.includes('wallet')
          )
          if (wagmiKeys.length > 0) {
            wagmiKeys.forEach(key => window.localStorage.removeItem(key))
            window.sessionStorage.setItem('reloadCount', '1')
          }
        }
      }
      return
    }

    // Buscar el conector de Coinbase Wallet (Base Account)
    const coinbaseConnector = connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    )

    if (!coinbaseConnector) {
      console.error('❌ KIN-001 AC-004: Coinbase Wallet connector not found')
      setError('Wallet connector not available')
      return
    }

    // Intentar auto-conectar con retry logic (AC-004)
    const attemptAutoConnect = async () => {
      try {
        hasAttemptedConnection.current = true
        retryCount.current++
        
        console.log(`🚀 KIN-001 AC-002: Attempting auto-connect (attempt ${retryCount.current}/${MAX_RETRIES})...`)
        
        await connect({ connector: coinbaseConnector })
        
        console.log('✅ KIN-001 AC-002: Auto-connect successful!')
        setError(null)
        retryCount.current = 0
      } catch (err: any) {
        console.error(`❌ KIN-001 AC-004: Auto-connect failed (attempt ${retryCount.current}):`, err)
        
        // Retry logic (AC-004)
        if (retryCount.current < MAX_RETRIES) {
          console.log(`🔄 KIN-001 AC-004: Retrying in ${RETRY_DELAY/1000}s...`)
          hasAttemptedConnection.current = false // Permitir reintentar
          setTimeout(attemptAutoConnect, RETRY_DELAY)
        } else {
          console.error('❌ KIN-001 AC-004: Max retries reached, connection failed')
          setError('Connection failed after multiple attempts')
        }
      }
    }

    // Delay pequeño para asegurar que todo esté montado
    const timeoutId = setTimeout(attemptAutoConnect, 500)

    return () => clearTimeout(timeoutId)
  }, [connect, connectors, isConnected])

  return { isConnected, error }
}

