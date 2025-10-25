'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { MarketCarousel } from "@/components/market-carousel"
import { PlusCircle, TrendingUp, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

export default function CustomMarkets() {
  const router = useRouter()
  // Mock data for user's markets
  const myMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 68,
      title: "My Custom Market 1",
      volume: "2.5k",
      playerName: "Custom",
      playerSubtext: "Sports",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 72,
      title: "My Custom Market 2",
      volume: "1.8k",
      playerName: "Custom",
      playerSubtext: "Tech",
      isTactical: true
    },
  ]

  const myPredictions = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 65,
      title: "Prediction Market 1",
      volume: "5.2k",
      playerName: "Crypto",
      playerSubtext: "Bitcoin",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 58,
      title: "Prediction Market 2",
      volume: "3.1k",
      playerName: "Politics",
      playerSubtext: "Elections",
      isTactical: true
    },
  ]

  return (
    <MobileLayout title="My Markets" activeTab="my-markets">
      {/* Quick Actions */}
      <section className="mb-6">
        <div className="grid grid-cols-2 gap-3 mb-4">
          <button 
            onClick={() => alert('Create market functionality coming soon!')}
            className="touch-target bg-blue-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-500 transition-colors"
          >
            <PlusCircle className="w-4 h-4" />
            Create Market
          </button>
          <button 
            onClick={() => alert('My predictions view coming soon!')}
            className="touch-target bg-purple-600 text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:bg-purple-500 transition-colors"
          >
            <TrendingUp className="w-4 h-4" />
            My Predictions
          </button>
        </div>
      </section>

      {/* My Created Markets */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">My Markets</h3>
          <span className="text-sm text-gray-400">{myMarkets.length} created</span>
        </div>
        {myMarkets.length > 0 ? (
          <div className="space-y-3">
            {myMarkets.map((market, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium text-sm line-clamp-2 flex-1 mr-3">{market.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{market.volume}</span>
                    <div className="w-12 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{market.percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-green-600/20 text-green-400 rounded">Created by you</span>
                    <span className="text-xs text-gray-400">{market.playerSubtext}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => alert('Edit market functionality coming soon!')}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => router.push(`/market/${index}`)}
                      className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      View →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <PlusCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">No markets created yet</h4>
            <p className="text-sm text-gray-400 mb-4">Create your first prediction market</p>
            <button 
              onClick={() => alert('Create market functionality coming soon!')}
              className="touch-target bg-blue-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-blue-500 transition-colors"
            >
              Create Market
            </button>
          </div>
        )}
      </section>

      {/* My Predictions */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">My Predictions</h3>
          <span className="text-sm text-gray-400">{myPredictions.length} active</span>
        </div>
        {myPredictions.length > 0 ? (
          <div className="space-y-3">
            {myPredictions.map((market, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-750 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-white font-medium text-sm line-clamp-2 flex-1 mr-3">{market.title}</h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">{market.volume}</span>
                    <div className="w-12 h-6 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-white">{market.percentage}%</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 bg-purple-600/20 text-purple-400 rounded">My Prediction</span>
                    <span className="text-xs text-gray-400">{market.playerSubtext}</span>
                  </div>
                  <button 
                    onClick={() => router.push(`/market/${index}`)}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    View →
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg p-6 text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h4 className="text-white font-medium mb-2">No predictions yet</h4>
            <p className="text-sm text-gray-400 mb-4">Start predicting on markets</p>
            <button 
              onClick={() => router.push('/all-markets')}
              className="touch-target bg-purple-600 text-white rounded-lg px-4 py-2 text-sm hover:bg-purple-500 transition-colors"
            >
              Browse Markets
            </button>
          </div>
        )}
      </section>

      {/* Recent Activity */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Recent Activity</h3>
        <div className="space-y-3">
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <Clock className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <div className="text-white text-sm">Created market "Will Bitcoin reach $100k?"</div>
              <div className="text-xs text-gray-400">2 hours ago</div>
            </div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <div className="text-white text-sm">Predicted on "Election 2024"</div>
              <div className="text-xs text-gray-400">1 day ago</div>
            </div>
          </div>
        </div>
      </section>
    </MobileLayout>
  )
}