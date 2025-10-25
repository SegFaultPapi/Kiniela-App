'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { User, Settings, Bell, HelpCircle, LogOut, TrendingUp, DollarSign, Trophy, Calendar, Copy, ExternalLink, Wallet, Activity } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAccount, useDisconnect, useBalance, useCapabilities } from "wagmi"
import { Avatar, Name, Address, Identity } from "@coinbase/onchainkit/identity"
import { base } from "wagmi/chains"
import { formatUnits } from "viem"
import { useState, useEffect, useMemo } from "react"
import { useEnsName } from "wagmi"

// USDC Contract Address on Base
const USDC_ADDRESS = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' as `0x${string}`

// Utility function to format address
function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

// Utility function to copy to clipboard
function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  // In a real app, you'd show a toast notification
  console.log('Copied to clipboard:', text)
}

export default function Profile() {
  const router = useRouter()
  const { address, isConnected } = useAccount()
  const { disconnect } = useDisconnect()
  
  // Get ENS name for the connected address
  const { data: ensName } = useEnsName({
    address: address,
    chainId: base.id,
    query: {
      enabled: !!address && isConnected,
      staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    }
  })

  // Get ETH balance
  const { data: ethBalance } = useBalance({
    address: address,
  })

  // Get USDC balance
  const { data: usdcBalance } = useBalance({
    address: address,
    token: USDC_ADDRESS,
    query: {
      enabled: !!address && isConnected,
    }
  })

  // Get Smart Wallet capabilities
  const { data: capabilities } = useCapabilities({
    account: address,
  })

  // State for copy feedback
  const [copiedAddress, setCopiedAddress] = useState(false)
  const [copiedEns, setCopiedEns] = useState(false)

  // Format balances
  const ethBalanceFormatted = ethBalance 
    ? parseFloat(formatUnits(ethBalance.value, ethBalance.decimals)).toFixed(4)
    : '0.0000'
  
  const usdcBalanceFormatted = usdcBalance 
    ? parseFloat(formatUnits(usdcBalance.value, usdcBalance.decimals)).toFixed(2)
    : '0.00'

  // Check if it's a Smart Wallet
  const isSmartWallet = capabilities && Object.keys(capabilities).length > 0
  const hasAtomicBatch = capabilities?.[base.id]?.atomicBatch?.supported
  const hasPaymaster = capabilities?.[base.id]?.paymasterService?.supported

  // Mock user stats (in real app, these would come from API)
  const userStats = useMemo(() => ({
    totalPredictions: 24,
    marketsCreated: 3,
    accuracy: 75,
    points: 1250,
    totalWinnings: 2340.50,
    activeBets: 7,
    joinDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
    lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
  }), [])

  // Handle copy address
  const handleCopyAddress = () => {
    if (address) {
      copyToClipboard(address)
      setCopiedAddress(true)
      setTimeout(() => setCopiedAddress(false), 2000)
    }
  }

  // Handle copy ENS
  const handleCopyEns = () => {
    if (ensName) {
      copyToClipboard(ensName)
      setCopiedEns(true)
      setTimeout(() => setCopiedEns(false), 2000)
    }
  }

  // Si no está conectado, mostrar mensaje
  if (!isConnected) {
    return (
      <MobileLayout title="Profile" activeTab="profile">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <User className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Wallet Connected</h3>
          <p className="text-gray-400 mb-6">Connect your wallet to view your profile</p>
          <button
            onClick={() => router.push('/')}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </MobileLayout>
    )
  }
  
  return (
    <MobileLayout title="Profile" activeTab="profile">
      {/* User Info Section - REAL DATA FROM SMART WALLET */}
      <section className="mb-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <div className="flex items-center gap-4 mb-4">
            <Avatar className="w-20 h-20" />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Name className="text-xl font-semibold text-white" />
                {isSmartWallet && (
                  <span className="text-blue-400 text-sm font-medium">⚡</span>
                )}
              </div>
              
              {/* ENS Name or Address */}
              {ensName ? (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-blue-400 font-medium">{ensName}</span>
                  <button
                    onClick={handleCopyEns}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy ENS name"
                  >
                    {copiedEns ? '✓' : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-gray-300 font-mono text-sm">{formatAddress(address!)}</span>
                  <button
                    onClick={handleCopyAddress}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Copy address"
                  >
                    {copiedAddress ? '✓' : <Copy className="w-3 h-3" />}
                  </button>
                </div>
              )}
              
              {/* Full Address */}
              <div className="text-xs text-gray-500 font-mono mb-2">
                {address}
              </div>
              
              {/* Connection Status */}
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-400">
                  {isSmartWallet ? 'Smart Wallet Connected' : 'Wallet Connected'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Smart Wallet Features */}
          {isSmartWallet && (
            <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Wallet className="w-4 h-4 text-blue-400" />
                <span className="text-blue-400 font-medium text-sm">Smart Wallet Features</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <span className={hasAtomicBatch ? 'text-green-400' : 'text-gray-500'}>
                    {hasAtomicBatch ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-300">Atomic Batch</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className={hasPaymaster ? 'text-green-400' : 'text-gray-500'}>
                    {hasPaymaster ? '✓' : '✗'}
                  </span>
                  <span className="text-gray-300">Paymaster</span>
                </div>
              </div>
            </div>
          )}
          
          {/* View on Explorer */}
          <button
            onClick={() => window.open(`https://basescan.org/address/${address}`, '_blank')}
            className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm">View on BaseScan</span>
          </button>
        </div>
      </section>

      {/* Wallet Balances - REAL DATA */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Wallet Balances</h3>
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">Ξ</span>
                </div>
                <div>
                  <div className="text-white font-medium">Ethereum</div>
                  <div className="text-gray-400 text-sm">Base Network</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">{ethBalanceFormatted} ETH</div>
                <div className="text-gray-400 text-sm">~${(parseFloat(ethBalanceFormatted) * 3000).toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">$</span>
                </div>
                <div>
                  <div className="text-white font-medium">USDC</div>
                  <div className="text-gray-400 text-sm">USD Coin</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">${usdcBalanceFormatted}</div>
                <div className="text-gray-400 text-sm">Stablecoin</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Your Stats</h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{userStats.totalPredictions}</div>
            <div className="text-sm text-gray-400">Predictions</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{userStats.marketsCreated}</div>
            <div className="text-sm text-gray-400">Markets Created</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{userStats.accuracy}%</div>
            <div className="text-sm text-gray-400">Accuracy</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-white">{userStats.points.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Points</div>
          </div>
        </div>
      </section>

      {/* Activity & Account Info */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Account Information</h3>
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">Member Since</div>
                  <div className="text-gray-400 text-sm">
                    {userStats.joinDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      year: 'numeric' 
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {Math.floor((Date.now() - userStats.joinDate.getTime()) / (1000 * 60 * 60 * 24))} days
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">Last Activity</div>
                  <div className="text-gray-400 text-sm">
                    {userStats.lastActivity.toLocaleDateString('en-US', { 
                      month: 'short', 
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-white font-bold">
                  {Math.floor((Date.now() - userStats.lastActivity.getTime()) / (1000 * 60 * 60))}h ago
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trophy className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">Total Winnings</div>
                  <div className="text-gray-400 text-sm">From successful predictions</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold">${userStats.totalWinnings.toFixed(2)}</div>
                <div className="text-gray-400 text-sm">USDC</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-gray-400" />
                <div>
                  <div className="text-white font-medium">Active Bets</div>
                  <div className="text-gray-400 text-sm">Currently pending</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-blue-400 font-bold">{userStats.activeBets}</div>
                <div className="text-gray-400 text-sm">Markets</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Settings Section */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Settings</h3>
        <div className="space-y-2">
          <button 
            onClick={() => alert('Settings functionality coming soon!')}
            className="w-full touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Settings className="w-5 h-5 text-gray-400" />
              <span className="text-white">General Settings</span>
            </div>
            <div className="text-gray-400">›</div>
          </button>
          
          <button 
            onClick={() => alert('Notifications functionality coming soon!')}
            className="w-full touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="text-white">Notifications</span>
            </div>
            <div className="text-gray-400">›</div>
          </button>
          
          <button 
            onClick={() => alert('Help & Support functionality coming soon!')}
            className="w-full touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 flex items-center justify-between hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="w-5 h-5 text-gray-400" />
              <span className="text-white">Help & Support</span>
            </div>
            <div className="text-gray-400">›</div>
          </button>
        </div>
      </section>

      {/* Logout Section */}
      <section className="mb-6">
        <button 
          onClick={() => {
            disconnect()
            router.push('/')
          }}
          className="w-full touch-target bg-red-600 text-white rounded-lg p-4 flex items-center justify-center gap-3 hover:bg-red-500 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span>Disconnect Wallet</span>
        </button>
      </section>
    </MobileLayout>
  )
}