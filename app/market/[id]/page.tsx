'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Clock, Users, TrendingUp, Share2, Loader2, CheckCircle } from "lucide-react"
import { formatUSDC, formatTimeRemaining, isClosingSoon } from "@/lib/market-utils"
import { useState, useMemo } from "react"

// KIN-003: Utility functions for market detail formatting
function formatDateTime(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })
}

function formatTimeAgo(dateString: string): string {
  const now = new Date().getTime()
  const date = new Date(dateString).getTime()
  const diff = now - date
  
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  // In a real app, you'd show a toast notification
  console.log('Copied to clipboard:', text)
}

// Market data type - KIN-003: Complete market detail interface
interface MarketDetail {
  id: string
  title: string
  description: string // AC-001: Complete description (max 500 chars)
  image?: string
  yesPercent: number
  noPercent: number
  poolTotal: number
  closesAt: string
  createdAt: string // AC-001: Creation timestamp
  category: string
  subcategory?: string
  status: 'active' | 'closing_soon' | 'closed' | 'resolved'
  createdBy: string // AC-001: Creator address (truncated)
  totalBets?: number
  uniqueBettors: number // AC-004: Unique bettors count
  lastBetAt: string
  recentActivity: BetActivity[] // AC-004: Recent betting activity
}

// AC-004: Bet activity interface
interface BetActivity {
  user: string // truncated address
  amount: number
  side: 'yes' | 'no'
  timestamp: string
}

// Mock data - KIN-003: Complete market detail data
const MOCK_MARKETS: Record<string, MarketDetail> = {
  "1": {
    id: "1",
    title: "Will Real Madrid beat FC Barcelona?",
    description: "Prediction about the outcome of the Spanish classic. The winner will be determined by the official result at the end of regular time (90 minutes + added time). This includes any penalties or extra time if applicable. The market will resolve based on the official match result from the league's official source.",
    image: "/placeholder.svg?height=400&width=600",
    yesPercent: 68,
    noPercent: 32,
    poolTotal: 12500,
    closesAt: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
    category: "Sports",
    subcategory: "Football",
    status: 'closing_soon',
    createdBy: "0x1234...5678",
    totalBets: 142,
    uniqueBettors: 89,
    lastBetAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    recentActivity: [
      {
        user: "0x4567...8901",
        amount: 150,
        side: 'yes',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString()
      },
      {
        user: "0x2345...6789",
        amount: 75,
        side: 'no',
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString()
      },
      {
        user: "0x7890...1234",
        amount: 200,
        side: 'yes',
        timestamp: new Date(Date.now() - 8 * 60 * 1000).toISOString()
      },
      {
        user: "0x3456...7890",
        amount: 100,
        side: 'no',
        timestamp: new Date(Date.now() - 12 * 60 * 1000).toISOString()
      },
      {
        user: "0x5678...9012",
        amount: 300,
        side: 'yes',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString()
      }
    ]
  },
  "soccer-1": {
    id: "soccer-1",
    title: "Real Madrid vs. FC Barcelona",
    description: "Prediction about the outcome of the Spanish classic. The winner will be determined by the official result at the end of regular time. This market focuses on the main result excluding penalties.",
    image: "/placeholder.svg?height=400&width=600",
    yesPercent: 68,
    noPercent: 32,
    poolTotal: 12500,
    closesAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    category: "Sports",
    subcategory: "Football",
    status: 'active',
    createdBy: "0x1234...5678",
    totalBets: 156,
    uniqueBettors: 95,
    lastBetAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    recentActivity: [
      {
        user: "0x1111...2222",
        amount: 250,
        side: 'yes',
        timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString()
      },
      {
        user: "0x3333...4444",
        amount: 125,
        side: 'no',
        timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString()
      },
      {
        user: "0x5555...6666",
        amount: 180,
        side: 'yes',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString()
      },
      {
        user: "0x7777...8888",
        amount: 90,
        side: 'no',
        timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString()
      },
      {
        user: "0x9999...0000",
        amount: 400,
        side: 'yes',
        timestamp: new Date(Date.now() - 18 * 60 * 1000).toISOString()
      }
    ]
  }
}

export default function MarketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const marketId = params.id as string
  
  const [betAmount, setBetAmount] = useState("")
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null)
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  const [betState, setBetState] = useState<'idle' | 'pending' | 'success' | 'error'>('idle')
  const [betError, setBetError] = useState<string | null>(null)
  
  // Get market data
  const market = MOCK_MARKETS[marketId] || MOCK_MARKETS["1"]
  
  const timeRemaining = formatTimeRemaining(market.closesAt)
  const isClosing = isClosingSoon(market.closesAt)
  
  // Calculate potential returns
  const potentialReturn = useMemo(() => {
    if (!betAmount || !selectedOption) return 0
    
    const amount = parseFloat(betAmount)
    if (isNaN(amount) || amount <= 0) return 0
    
    // Simple calculation: (bet / current_percent) * 100
    const percent = selectedOption === 'yes' ? market.yesPercent : market.noPercent
    return (amount / percent) * 100
  }, [betAmount, selectedOption, market.yesPercent, market.noPercent])

  // KIN-004: Handle bet placement
  const handlePlaceBet = async () => {
    if (!selectedOption || !betAmount || parseFloat(betAmount) <= 0) return
    
    setBetState('pending')
    setBetError(null)
    
    try {
      // Simulate transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      setBetState('success')
      
      // Reset form after success
      setTimeout(() => {
        setSelectedOption(null)
        setBetAmount('')
        setBetState('idle')
      }, 3000)
      
    } catch (err) {
      setBetError('Transaction failed. Please try again.')
      setBetState('error')
    }
  }

  return (
    <MobileLayout title="Market Details" activeTab="markets">
      {/* Header con imagen */}
      <div className="relative -mx-4 -mt-4 mb-6">
        {market.image && (
          <div className="relative h-48 bg-gray-900">
            <img 
              src={market.image} 
              alt={market.title}
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a2332] to-transparent"></div>
          </div>
        )}
        
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 w-10 h-10 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-white" />
        </button>
        
        {/* AC-004: Share button */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: market.title,
                text: `Check out this prediction market: ${market.title}`,
                url: window.location.href
              })
            } else {
              // Fallback: copy URL to clipboard
              copyToClipboard(window.location.href)
            }
          }}
          className="absolute top-4 right-4 w-10 h-10 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* AC-001: Market Title and Description */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-3">{market.title}</h1>
        
        {/* AC-001: Expandable description (max 500 chars) */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <p className="text-gray-300 text-sm leading-relaxed">
            {market.description.length > 200 && !isDescriptionExpanded ? (
              <>
                {market.description.slice(0, 200)}...
                <button 
                  onClick={() => setIsDescriptionExpanded(true)}
                  className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
                >
                  Read more
                </button>
              </>
            ) : (
              <>
                {market.description}
                {market.description.length > 200 && isDescriptionExpanded && (
                  <button 
                    onClick={() => setIsDescriptionExpanded(false)}
                    className="text-blue-400 hover:text-blue-300 ml-1 font-medium"
                  >
                    Show less
                  </button>
                )}
              </>
            )}
          </p>
        </div>
      </section>

      {/* AC-001 & AC-004: Market Stats */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-gray-400">Pool</span>
            </div>
            <div className="text-lg font-bold text-white">{formatUSDC(market.poolTotal)}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Users className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Bettors</span>
            </div>
            <div className="text-lg font-bold text-white">{market.uniqueBettors}</div>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock className={`w-4 h-4 ${isClosing ? 'text-yellow-400' : 'text-gray-400'}`} />
              <span className="text-xs text-gray-400">Closes</span>
            </div>
            <div className={`text-lg font-bold ${isClosing ? 'text-yellow-400' : 'text-white'}`}>
              {formatDateTime(market.closesAt)}
            </div>
            <div className="text-xs text-gray-500">{timeRemaining} remaining</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs text-gray-400">Created</span>
            </div>
            <div className="text-lg font-bold text-white">{formatDateTime(market.createdAt)}</div>
            <div className="text-xs text-gray-500">{formatTimeAgo(market.createdAt)}</div>
          </div>
        </div>
      </section>

      {/* AC-002: Enhanced Odds Visualization */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Current Odds</h3>
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          {/* AC-002: Prominent odds display */}
          <div className="flex justify-center items-center mb-6">
            <div className="relative w-32 h-32">
              {/* Circular progress background */}
              <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgb(55, 65, 81)"
                  strokeWidth="8"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="rgb(34, 197, 94)"
                  strokeWidth="8"
                  strokeDasharray={`${(market.yesPercent / 100) * 283} 283`}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">{market.yesPercent}%</div>
                  <div className="text-xs text-gray-400">YES</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* AC-002: Detailed breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{market.yesPercent}%</div>
              <div className="text-sm text-gray-400">YES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{market.noPercent}%</div>
              <div className="text-sm text-gray-400">NO</div>
            </div>
          </div>
          
          {/* AC-002: Pool distribution */}
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-500 transition-all duration-300" 
              style={{ width: `${market.yesPercent}%` }}
            ></div>
            <div 
              className="bg-red-500 transition-all duration-300" 
              style={{ width: `${market.noPercent}%` }}
            ></div>
          </div>
          
          {/* AC-002: Pool total display */}
          <div className="text-center mt-3">
            <span className="text-gray-400 text-sm">Pool Total: </span>
            <span className="text-white font-bold">{formatUSDC(market.poolTotal)}</span>
          </div>
        </div>
      </section>

      {/* Place Bet Section */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Place Your Bet</h3>
        
        {/* AC-003: Prominent betting buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setSelectedOption('yes')}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedOption === 'yes'
                ? 'bg-green-600/20 border-green-500 text-green-400 shadow-lg shadow-green-500/20'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-750'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">YES</div>
              <div className="text-lg font-semibold">{market.yesPercent}%</div>
              <div className="text-xs text-gray-500 mt-1">Bet YES</div>
            </div>
          </button>
          
          <button
            onClick={() => setSelectedOption('no')}
            className={`p-6 rounded-lg border-2 transition-all ${
              selectedOption === 'no'
                ? 'bg-red-600/20 border-red-500 text-red-400 shadow-lg shadow-red-500/20'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600 hover:bg-gray-750'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl font-bold mb-1">NO</div>
              <div className="text-lg font-semibold">{market.noPercent}%</div>
              <div className="text-xs text-gray-500 mt-1">Bet NO</div>
            </div>
          </button>
        </div>

        {/* Amount Input */}
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 mb-4">
          <label className="block text-sm text-gray-400 mb-2">Bet Amount (USDC)</label>
          <input
            type="number"
            value={betAmount}
            onChange={(e) => setBetAmount(e.target.value)}
            placeholder="0.00"
            className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-blue-500"
          />
          
          {/* Quick amounts */}
          <div className="flex gap-2 mt-3">
            {[10, 25, 50, 100].map(amount => (
              <button
                key={amount}
                onClick={() => setBetAmount(amount.toString())}
                className="flex-1 px-3 py-1 bg-gray-700 hover:bg-gray-600 rounded text-sm text-white transition-colors"
              >
                ${amount}
              </button>
            ))}
          </div>
        </div>

        {/* AC-003: Shares Preview and Calculator */}
        {betAmount && parseFloat(betAmount) > 0 && selectedOption && (
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
            <div className="space-y-3">
              {/* AC-003: Preview of shares estimated */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Estimated Shares</span>
                <span className="text-lg font-bold text-blue-400">
                  ~{Math.round(parseFloat(betAmount) / (selectedOption === 'yes' ? (market.yesPercent / 100) : (market.noPercent / 100)))} shares
                </span>
              </div>
              
              {/* AC-003: Real-time potential winnings calculator */}
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Potential Return</span>
                <span className="text-xl font-bold text-blue-400">
                  {formatUSDC(potentialReturn)}
                </span>
              </div>
              
              <div className="text-xs text-gray-500">
                If {selectedOption?.toUpperCase()} wins • ROI: +{Math.round(((potentialReturn - parseFloat(betAmount)) / parseFloat(betAmount)) * 100)}%
              </div>
              
              {/* AC-003: Warning if pool is too small */}
              {market.poolTotal < 10 && (
                <div className="bg-yellow-600/10 border border-yellow-600/30 rounded p-2 mt-2">
                  <div className="text-yellow-400 text-xs font-medium">
                    ⚠️ Small pool warning: Market has less than $10 total
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* AC-003: Place Bet Button with disabled state for closed markets */}
        <button
          onClick={handlePlaceBet}
          disabled={!selectedOption || !betAmount || parseFloat(betAmount) <= 0 || market.status === 'closed' || market.status === 'resolved' || betState === 'pending'}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-lg transition-colors disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
        >
          {betState === 'pending' && <Loader2 className="w-5 h-5 animate-spin" />}
          {betState === 'success' && <CheckCircle className="w-5 h-5" />}
          
          {betState === 'pending' ? 'Submitting bet...' :
           betState === 'success' ? 'Bet placed successfully!' :
           market.status === 'closed' || market.status === 'resolved' 
             ? 'Market Closed' 
             : !selectedOption 
               ? 'Select YES or NO' 
               : !betAmount 
                 ? 'Enter Amount' 
                 : `Place ${selectedOption?.toUpperCase()} Bet`}
        </button>
        
        {/* AC-005: Error message */}
        {betError && (
          <div className="mt-3 bg-red-600/10 border border-red-600/30 rounded-lg p-3">
            <div className="text-red-400 text-sm font-medium">
              ⚠️ {betError}
            </div>
          </div>
        )}
        
        {/* AC-003: Warning message for closed markets */}
        {(market.status === 'closed' || market.status === 'resolved') && (
          <div className="mt-3 bg-red-600/10 border border-red-600/30 rounded-lg p-3">
            <div className="text-red-400 text-sm font-medium">
              ⚠️ This market is no longer accepting bets
            </div>
          </div>
        )}
      </section>

      {/* AC-004: Recent Activity */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          {market.recentActivity.length > 0 ? (
            <div className="divide-y divide-gray-700">
              {market.recentActivity.map((activity, index) => (
                <div key={index} className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      activity.side === 'yes' ? 'bg-green-500' : 'bg-red-500'
                    }`}></div>
                    <div>
                      <div className="text-white text-sm font-medium">
                        {activity.side === 'yes' ? 'YES' : 'NO'} bet
                      </div>
                      <div className="text-gray-400 text-xs">
                        {activity.user} • {formatTimeAgo(activity.timestamp)}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-white font-bold">{formatUSDC(activity.amount)}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center text-gray-400">
              No recent activity
            </div>
          )}
        </div>
      </section>

      {/* AC-001: Market Information */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Market Information</h3>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Category</span>
            <span className="text-white font-medium">{market.category}</span>
          </div>
          {market.subcategory && (
            <div className="flex justify-between">
              <span className="text-gray-400">Subcategory</span>
              <span className="text-white font-medium">{market.subcategory}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-gray-400">Status</span>
            <span className={`font-medium ${
              market.status === 'active' ? 'text-green-400' :
              market.status === 'closing_soon' ? 'text-yellow-400' :
              'text-gray-400'
            }`}>
              {market.status === 'active' ? 'Active' : 
               market.status === 'closing_soon' ? 'Closing Soon' : 
               market.status}
            </span>
          </div>
          {/* AC-001: Creator address with copy button */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Creator</span>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-mono text-sm">{market.createdBy}</span>
              <button
                onClick={() => copyToClipboard(market.createdBy)}
                className="text-gray-400 hover:text-white transition-colors"
                title="Copy address"
              >
                📋
              </button>
            </div>
          </div>
        </div>
      </section>
    </MobileLayout>
  )
}

