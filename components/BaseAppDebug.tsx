'use client'

import { useEffect, useState } from 'react'

export function BaseAppDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null)

  useEffect(() => {
    const gatherDebugInfo = () => {
      const info = {
        // Environment detection
        hostname: window.location.hostname,
        userAgent: window.navigator.userAgent,
        referrer: document.referrer,
        search: window.location.search,
        isIframe: window.parent !== window,
        
        // Ethereum provider
        hasEthereum: !!window.ethereum,
        ethereumKeys: window.ethereum ? Object.keys(window.ethereum) : [],
        isBaseApp: !!(window as any).ethereum?.isBaseApp,
        
        // Storage
        localStorage: {
          baseApp: window.localStorage.getItem('baseApp'),
          wagmiStore: window.localStorage.getItem('wagmi.store'),
          userConnectedWallet: window.sessionStorage.getItem('userConnectedWallet'),
          walletVerified: window.sessionStorage.getItem('walletVerified'),
        },
        
        // Wagmi connectors
        connectors: typeof window !== 'undefined' && window.wagmi ? 
          Object.keys(window.wagmi) : 'No wagmi in window',
        
        // Timestamp
        timestamp: new Date().toISOString()
      }
      
      setDebugInfo(info)
      console.log('🔍 Base App Debug Info:', info)
    }

    gatherDebugInfo()
    
    // Update every 5 seconds
    const interval = setInterval(gatherDebugInfo, 5000)
    return () => clearInterval(interval)
  }, [])

  if (!debugInfo) return null

  return (
    <div className="fixed bottom-4 right-4 bg-gray-800 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔍 Base App Debug</h3>
      <div className="space-y-1">
        <div><strong>Hostname:</strong> {debugInfo.hostname}</div>
        <div><strong>Is Base App:</strong> {debugInfo.isBaseApp ? '✅' : '❌'}</div>
        <div><strong>Has Ethereum:</strong> {debugInfo.hasEthereum ? '✅' : '❌'}</div>
        <div><strong>Is Iframe:</strong> {debugInfo.isIframe ? '✅' : '❌'}</div>
        <div><strong>Ethereum Keys:</strong> {debugInfo.ethereumKeys.join(', ')}</div>
        <div><strong>Referrer:</strong> {debugInfo.referrer || 'None'}</div>
        <div><strong>Search:</strong> {debugInfo.search || 'None'}</div>
        <div><strong>Base App Storage:</strong> {debugInfo.localStorage.baseApp || 'None'}</div>
        <div><strong>Wagmi Store:</strong> {debugInfo.localStorage.wagmiStore ? '✅' : '❌'}</div>
      </div>
      <button
        onClick={() => {
          window.sessionStorage.setItem('baseApp', 'true')
          window.location.reload()
        }}
        className="mt-2 bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded text-xs"
      >
        Force Base App
      </button>
    </div>
  )
}
