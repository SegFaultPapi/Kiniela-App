'use client'

import { AutoWalletConnect } from '@/components/auth/AutoWalletConnect'
import AuthButton from '@/components/auth/AuthButton'
import { QuickAuth } from '@/components/auth/QuickAuth'
import { SecurityExample } from '@/components/auth/SecurityExample'
import { WalletConnection } from '@/components/wallet-connection'
import Link from 'next/link'
import { ArrowLeft, Shield, Zap, RefreshCw, Settings } from 'lucide-react'

export default function AuthDemo() {
  return (
    <div className="min-h-screen bg-[#1a2332] text-white">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2 text-blue-400 hover:text-blue-300">
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm">Back to App</span>
        </Link>
        <h1 className="text-lg font-bold">KIN-001 Authentication Demo</h1>
        <WalletConnection />
      </header>

      {/* Main Content */}
      <main className="px-6 py-8">
        {/* Introduction */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">🔐 Wallet Connection Implementation</h2>
          <p className="text-gray-400 mb-6">
            This page demonstrates all authentication methods implemented for ticket KIN-001. 
            Each method handles different scenarios for connecting wallets in the Base ecosystem.
          </p>
        </div>

        {/* Auto Wallet Connect */}
        <section className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <RefreshCw className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-semibold">Auto Wallet Connect</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Automatically detects Base App environment and connects wallet with cryptographic authentication.
            Falls back to manual connection for external wallets.
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <AutoWalletConnect>
              <div className="p-4 bg-green-900/20 border border-green-500/30 rounded-lg">
                <p className="text-green-400 text-sm">
                  ✅ Auto wallet connection is active. The app will automatically detect Base App environment and connect the wallet.
                </p>
              </div>
            </AutoWalletConnect>
          </div>
        </section>

        {/* Manual Authentication */}
        <section className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="w-6 h-6 text-purple-400" />
            <h3 className="text-xl font-semibold">Manual Authentication</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Manual authentication button with Farcaster Sign In and session management.
            Includes loading states and error handling.
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <AuthButton />
          </div>
        </section>

        {/* Quick Auth */}
        <section className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h3 className="text-xl font-semibold">Quick Auth</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Instant authentication using Farcaster's identity system with JWT verification.
            No passwords or complex OAuth flows required.
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <QuickAuth />
          </div>
        </section>

        {/* Security Example */}
        <section className="mb-8 p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-6 h-6 text-red-400" />
            <h3 className="text-xl font-semibold">Security Example</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Demonstrates the difference between context (UX hints) and authentication (cryptographic security).
            Shows when to use each approach.
          </p>
          <div className="bg-gray-900/50 p-4 rounded-lg">
            <SecurityExample />
          </div>
        </section>

        {/* Implementation Details */}
        <section className="mb-8 p-6 bg-blue-900/20 rounded-xl border border-blue-500/30">
          <h3 className="text-xl font-semibold mb-4">📋 Implementation Details</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Components Created:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• AutoWalletConnect.tsx</li>
                <li>• AuthButton.tsx</li>
                <li>• QuickAuth.tsx</li>
                <li>• SecurityExample.tsx</li>
                <li>• AuthManager.tsx</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">API Endpoints:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• /api/auth (JWT verification)</li>
                <li>• /api/user-session (session management)</li>
                <li>• /api/trpc/* (existing endpoints)</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Acceptance Criteria */}
        <section className="mb-8 p-6 bg-green-900/20 rounded-xl border border-green-500/30">
          <h3 className="text-xl font-semibold mb-4">✅ Acceptance Criteria Status</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-300">AC-001: Detect Base App Wallet automatically</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-300">AC-002: Connect wallet without additional steps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-300">AC-003: Fallback for external wallets</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
              <span className="text-gray-300">AC-004: Handle connection errors gracefully</span>
            </div>
          </div>
        </section>

        {/* Technical Stack */}
        <section className="p-6 bg-gray-800/50 rounded-xl border border-gray-700">
          <h3 className="text-xl font-semibold mb-4">🛠️ Technical Stack</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Frontend:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• @coinbase/onchainkit</li>
                <li>• @coinbase/onchainkit/minikit</li>
                <li>• wagmi</li>
                <li>• @farcaster/miniapp-sdk</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Backend:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• @farcaster/quick-auth</li>
                <li>• Next.js API Routes</li>
                <li>• JWT verification</li>
                <li>• Session management</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-400 mb-2">Features:</h4>
              <ul className="space-y-1 text-gray-300">
                <li>• Cryptographic authentication</li>
                <li>• Auto-detection</li>
                <li>• Error handling</li>
                <li>• Loading states</li>
              </ul>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
