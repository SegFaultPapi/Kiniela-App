'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { MarketCarousel } from "@/components/market-carousel"
import { Search, Filter } from "lucide-react"

export default function AllMarkets() {
  // Mock data for all markets with more details
  const allMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 68,
      title: "Real Madrid vs. FC Barcelona",
      volume: "12.5k",
      playerName: "Sports",
      playerSubtext: "Football",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 72,
      title: "Man. United vs. Liverpool",
      volume: "10.1k",
      playerName: "Sports",
      playerSubtext: "Football",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 65,
      title: "PSG vs. Bayern Munich",
      volume: "11.3k",
      playerName: "Sports",
      playerSubtext: "Football",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 58,
      title: "Chelsea vs. Arsenal",
      volume: "9.8k",
      playerName: "Sports",
      playerSubtext: "Football",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 71,
      title: "Juventus vs. AC Milan",
      volume: "8.9k",
      playerName: "Sports",
      playerSubtext: "Football",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 62,
      title: "Will Biden win 2024 election?",
      volume: "18.5k",
      playerName: "Politics",
      playerSubtext: "Elections",
      isTactical: true
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 67,
      title: "S&P 500 reaches 6000 by year end?",
      volume: "22.4k",
      playerName: "Economy",
      playerSubtext: "Stocks",
      isTactical: false
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 76,
      title: "GPT-5 launches in 2024?",
      volume: "20.3k",
      playerName: "Technology",
      playerSubtext: "AI",
      isTactical: true
    },
  ]

  return (
    <MobileLayout title="All Markets" activeTab="all-markets">
      {/* Search and Filter Section */}
      <section className="mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search markets..."
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="touch-target bg-gray-800 border border-gray-700 rounded-lg px-4 flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </section>

      {/* All Markets List */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">All Markets</h3>
          <span className="text-sm text-gray-400">{allMarkets.length} markets</span>
        </div>
        <div className="space-y-3">
          {allMarkets.map((market, index) => (
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
                  <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded">{market.playerName}</span>
                  <span className="text-xs text-gray-400">{market.playerSubtext}</span>
                </div>
                <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          <button className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors">
            <div className="text-white font-medium mb-1">Sports</div>
            <div className="text-sm text-gray-400">45 markets</div>
          </button>
          <button className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors">
            <div className="text-white font-medium mb-1">Politics</div>
            <div className="text-sm text-gray-400">23 markets</div>
          </button>
          <button className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors">
            <div className="text-white font-medium mb-1">Economy</div>
            <div className="text-sm text-gray-400">18 markets</div>
          </button>
          <button className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors">
            <div className="text-white font-medium mb-1">Technology</div>
            <div className="text-sm text-gray-400">12 markets</div>
          </button>
        </div>
      </section>
    </MobileLayout>
  )
}