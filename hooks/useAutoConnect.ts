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

    // Detectar si estamos en Base App (detección más agresiva)
    const isBaseApp = typeof window !== 'undefined' && (
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

    if (!isBaseApp) {
      console.log('🔗 KIN-001 AC-002: Not in Base App, skipping auto-connect')
      console.log('🔍 Base App Detection Details:', {
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
      
      // SECURITY: En desarrollo, limpiar conexiones no autorizadas SOLO en primera carga
      // NO limpiar en navegación entre páginas para mantener persistencia
      if (typeof window !== 'undefined' && window.localStorage && !isConnected) {
        const hasCheckedSecurity = window.sessionStorage.getItem('securityCheckDone')
        const userInitiated = window.sessionStorage.getItem('userConnectedWallet')
        
        // Solo hacer limpieza si es primera visita y no hay conexión autorizada por el usuario
        if (!hasCheckedSecurity && !userInitiated) {
          console.log('🔒 SECURITY: First load security check')
          const wagmiKeys = Object.keys(window.localStorage).filter(key => 
            key.startsWith('wagmi.') || key.includes('wallet')
          )
          if (wagmiKeys.length > 0) {
            console.log('🔒 SECURITY: Cleaning unauthorized cached connections')
            wagmiKeys.forEach(key => window.localStorage.removeItem(key))
          }
          window.sessionStorage.setItem('securityCheckDone', 'true')
        }
      }
      return
    }

    console.log('✅ KIN-001 AC-002: Base App detected, proceeding with auto-connect')
    console.log('🔍 Base App Detection Details:', {
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

    // Buscar el conector de Coinbase Wallet (Base Account)
    const coinbaseConnector = connectors.find(
      connector => connector.id === 'coinbaseWalletSDK'
    )

    if (!coinbaseConnector) {
      console.error('❌ KIN-001 AC-004: Coinbase Wallet connector not found')
      console.log('Available connectors:', connectors.map(c => ({ id: c.id, name: c.name })))
      setError('Wallet connector not available')
      return
    }

    console.log('🔗 Found Coinbase Wallet connector:', {
      id: coinbaseConnector.id,
      name: coinbaseConnector.name,
      type: coinbaseConnector.type
    })

    // Intentar auto-conectar con retry logic (AC-004)
    const attemptAutoConnect = async () => {
      try {
        hasAttemptedConnection.current = true
        retryCount.current++
        
        console.log(`🚀 KIN-001 AC-002: Attempting auto-connect (attempt ${retryCount.current}/${MAX_RETRIES})...`)
        console.log('🔧 Connector details:', {
          id: coinbaseConnector.id,
          name: coinbaseConnector.name,
          type: coinbaseConnector.type,
          isBaseApp: isBaseApp,
          userAgent: window.navigator.userAgent,
          hostname: window.location.hostname
        })
        
        await connect({ connector: coinbaseConnector })
        
        console.log('✅ KIN-001 AC-002: Auto-connect successful!')
        setError(null)
        retryCount.current = 0
      } catch (err: any) {
        console.error(`❌ KIN-001 AC-004: Auto-connect failed (attempt ${retryCount.current}):`, err)
        console.error('Error details:', {
          message: err.message,
          code: err.code,
          stack: err.stack,
          connectorId: coinbaseConnector.id
        })
        
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

