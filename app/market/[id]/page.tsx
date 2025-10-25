'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Clock, Users, TrendingUp, Share2 } from "lucide-react"
import { formatUSDC, formatTimeRemaining, isClosingSoon } from "@/lib/market-utils"
import { useState, useMemo } from "react"

// Market data type - unificado para Featured y All Markets
interface MarketDetail {
  id: string
  title: string
  description?: string
  image?: string
  yesPercent: number
  noPercent: number
  poolTotal: number
  closesAt: string
  category: string
  subcategory?: string
  status: 'active' | 'closing_soon' | 'closed' | 'resolved'
  createdBy?: string
  totalBets?: number
  lastBetAt: string
}

// Mock data - en producción vendría de API
const MOCK_MARKETS: Record<string, MarketDetail> = {
  "1": {
    id: "1",
    title: "Will Real Madrid beat FC Barcelona?",
    description: "Prediction about the outcome of the Spanish classic. The winner will be determined by the official result at the end of regular time (90 minutes + added time).",
    image: "/placeholder.svg?height=400&width=600",
    yesPercent: 68,
    noPercent: 32,
    poolTotal: 12500,
    closesAt: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
    category: "Sports",
    subcategory: "Football",
    status: 'closing_soon',
    createdBy: "0x1234...5678",
    totalBets: 142,
    lastBetAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  },
  "soccer-1": {
    id: "soccer-1",
    title: "Real Madrid vs. FC Barcelona",
    description: "Prediction about the outcome of the Spanish classic. The winner will be determined by the official result at the end of regular time.",
    image: "/placeholder.svg?height=400&width=600",
    yesPercent: 68,
    noPercent: 32,
    poolTotal: 12500,
    closesAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    category: "Sports",
    subcategory: "Football",
    status: 'active',
    createdBy: "0x1234...5678",
    totalBets: 156,
    lastBetAt: new Date(Date.now() - 5 * 60 * 1000).toISOString()
  }
}

export default function MarketDetailPage() {
  const router = useRouter()
  const params = useParams()
  const marketId = params.id as string
  
  const [betAmount, setBetAmount] = useState("")
  const [selectedOption, setSelectedOption] = useState<'yes' | 'no' | null>(null)
  
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
        
        {/* Share button */}
        <button
          className="absolute top-4 right-4 w-10 h-10 bg-gray-900/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors"
        >
          <Share2 className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Market Title */}
      <section className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">{market.title}</h1>
        {market.description && (
          <p className="text-gray-400 text-sm leading-relaxed">{market.description}</p>
        )}
      </section>

      {/* Market Stats */}
      <section className="mb-6">
        <div className="grid grid-cols-3 gap-3">
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
              <span className="text-xs text-gray-400">Bets</span>
            </div>
            <div className="text-lg font-bold text-white">{market.totalBets || 0}</div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-3 border border-gray-700">
            <div className="flex items-center gap-2 mb-1">
              <Clock className={`w-4 h-4 ${isClosing ? 'text-yellow-400' : 'text-gray-400'}`} />
              <span className="text-xs text-gray-400">Closes</span>
            </div>
            <div className={`text-lg font-bold ${isClosing ? 'text-yellow-400' : 'text-white'}`}>
              {timeRemaining}
            </div>
          </div>
        </div>
      </section>

      {/* Current Odds */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Current Odds</h3>
        <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
          <div className="flex justify-between items-center mb-2">
            <span className="text-green-400 font-bold text-xl">YES {market.yesPercent}%</span>
            <span className="text-red-400 font-bold text-xl">NO {market.noPercent}%</span>
          </div>
          <div className="w-full h-3 bg-gray-700 rounded-full overflow-hidden flex">
            <div 
              className="bg-green-500 transition-all duration-300" 
              style={{ width: `${market.yesPercent}%` }}
            ></div>
            <div 
              className="bg-red-500 transition-all duration-300" 
              style={{ width: `${market.noPercent}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Place Bet Section */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Place Your Bet</h3>
        
        {/* Option Selection */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button
            onClick={() => setSelectedOption('yes')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedOption === 'yes'
                ? 'bg-green-600/20 border-green-500 text-green-400'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            <div className="text-2xl font-bold mb-1">YES</div>
            <div className="text-sm">{market.yesPercent}% chance</div>
          </button>
          
          <button
            onClick={() => setSelectedOption('no')}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedOption === 'no'
                ? 'bg-red-600/20 border-red-500 text-red-400'
                : 'bg-gray-800 border-gray-700 text-gray-400 hover:border-gray-600'
            }`}
          >
            <div className="text-2xl font-bold mb-1">NO</div>
            <div className="text-sm">{market.noPercent}% chance</div>
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

        {/* Potential Return */}
        {potentialReturn > 0 && (
          <div className="bg-blue-600/10 border border-blue-600/30 rounded-lg p-4 mb-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Potential Return</span>
              <span className="text-xl font-bold text-blue-400">
                {formatUSDC(potentialReturn)}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              If {selectedOption?.toUpperCase()} wins
            </div>
          </div>
        )}

        {/* Place Bet Button */}
        <button
          disabled={!selectedOption || !betAmount || parseFloat(betAmount) <= 0}
          className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 text-white font-bold py-4 rounded-lg transition-colors disabled:cursor-not-allowed"
        >
          {!selectedOption ? 'Select YES or NO' : !betAmount ? 'Enter Amount' : 'Place Bet'}
        </button>
      </section>

      {/* Market Info */}
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
          {market.createdBy && (
            <div className="flex justify-between">
              <span className="text-gray-400">Creator</span>
              <span className="text-blue-400 font-mono text-sm">{market.createdBy}</span>
            </div>
          )}
        </div>
      </section>
    </MobileLayout>
  )
}

