'use client'

import { AutoWalletConnect } from './AutoWalletConnect'
import AuthButton from './AuthButton'
import { QuickAuth } from './QuickAuth'
import { SecurityExample } from './SecurityExample'
import { useState } from 'react'

type AuthMethod = 'auto' | 'manual' | 'quick' | 'demo'

export function AuthManager({ children }: { children: React.ReactNode }) {
  const [authMethod, setAuthMethod] = useState<AuthMethod>('auto')

  return (
    <div className="min-h-screen bg-[#1a2332]">
      {/* Auth Method Selector */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-white">Authentication Methods</h2>
          <div className="text-sm text-gray-400">
            KIN-001 Implementation
          </div>
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setAuthMethod('auto')}
            className={`px-3 py-1 text-xs rounded ${
              authMethod === 'auto' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Auto Connect
          </button>
          <button
            onClick={() => setAuthMethod('manual')}
            className={`px-3 py-1 text-xs rounded ${
              authMethod === 'manual' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Manual Auth
          </button>
          <button
            onClick={() => setAuthMethod('quick')}
            className={`px-3 py-1 text-xs rounded ${
              authMethod === 'quick' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Quick Auth
          </button>
          <button
            onClick={() => setAuthMethod('demo')}
            className={`px-3 py-1 text-xs rounded ${
              authMethod === 'demo' 
                ? 'bg-blue-600 text-white' 
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Security Demo
          </button>
        </div>
      </div>

      {/* Auth Method Content */}
      <div className="p-4">
        {authMethod === 'auto' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              🔄 Auto Wallet Connect
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Automatically detects Base App and connects wallet with cryptographic authentication.
            </p>
            <AutoWalletConnect>
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Auto wallet connection is active. The app will automatically detect Base App environment and connect the wallet.
                </p>
              </div>
            </AutoWalletConnect>
          </div>
        )}

        {authMethod === 'manual' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              🔐 Manual Authentication
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Manual authentication button with Farcaster Sign In and session management.
            </p>
            <AuthButton />
          </div>
        )}

        {authMethod === 'quick' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              ⚡ Quick Auth
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Instant authentication using Farcaster's identity system with JWT verification.
            </p>
            <QuickAuth />
          </div>
        )}

        {authMethod === 'demo' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-white mb-3">
              🛡️ Security Example
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              Demonstrates the difference between context (UX) and authentication (security).
            </p>
            <SecurityExample />
          </div>
        )}
      </div>

      {/* Main App Content */}
      <div className="border-t border-gray-700">
        {children}
      </div>
    </div>
  )
}
