"use client"

import { useState } from "react"
import { Menu, Plus, Search, Star, List, User, Filter, PlusCircle } from "lucide-react"
import Link from "next/link"

interface Market {
  id: string
  icon: string
  title: string
  description: string
  value?: string
  percentage: string
  probability: number
  category: string
}

export default function AllMarketsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showCategoryFilter, setShowCategoryFilter] = useState(false)

  const allMarkets: Market[] = [
    {
      id: "1",
      icon: "/placeholder.svg?height=80&width=80",
      title: "ETH Price Prediction",
      description: "Will ETH be above $3,000 on Dec 31?",
      value: "$1,984.52",
      percentage: "+2.5%",
      probability: 68,
      category: "Crypto",
    },
    {
      id: "2",
      icon: "/placeholder.svg?height=80&width=80",
      title: "Crypto Market Cap",
      description: "Will total market cap exceed $3T?",
      value: "$2.8T",
      percentage: "-1.2%",
      probability: 45,
      category: "Crypto",
    },
    {
      id: "3",
      icon: "/placeholder.svg?height=80&width=80",
      title: "Interest Rate Hike",
      description: "Will the Fed raise rates next meeting?",
      percentage: "78%",
      probability: 78,
      category: "Economy",
    },
    {
      id: "4",
      icon: "/placeholder.svg?height=80&width=80",
      title: "Bitcoin Price Prediction",
      description: "Will BTC reach $100k in 2024?",
      value: "$98,750.10",
      percentage: "-0.8%",
      probability: 35,
      category: "Crypto",
    },
    {
      id: "5",
      icon: "/placeholder.svg?height=80&width=80",
      title: "Climate Change Prediction",
      description: "Global temp increase >1.5°C by 2030?",
      percentage: "92%",
      probability: 92,
      category: "Environment",
    },
    {
      id: "6",
      icon: "/placeholder.svg?height=80&width=80",
      title: "US Election Margin",
      description: "Next election margin <1%?",
      percentage: "65%",
      probability: 65,
      category: "Politics",
    },
    {
      id: "7",
      icon: "/placeholder.svg?height=80&width=80",
      title: "California Earthquake",
      description: "Magnitude 7.0+ quake in CA by 2025?",
      percentage: "88%",
      probability: 88,
      category: "Environment",
    },
    {
      id: "8",
      icon: "/placeholder.svg?height=80&width=80",
      title: "Gasoline Price Prediction",
      description: "US gasoline price >$5/gallon?",
      value: "$4.89",
      percentage: "-3.1%",
      probability: 32,
      category: "Economy",
    },
  ]

  const filteredMarkets = allMarkets.filter((market) => {
    const matchesSearch =
      market.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      market.category.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCategory = selectedCategory ? market.category === selectedCategory : true

    return matchesSearch && matchesCategory
  })

  const groupedMarkets = filteredMarkets.reduce(
    (acc, market) => {
      if (!acc[market.category]) {
        acc[market.category] = []
      }
      acc[market.category].push(market)
      return acc
    },
    {} as Record<string, Market[]>,
  )

  const categories = Array.from(new Set(allMarkets.map((m) => m.category)))

  return (
    <div className="min-h-screen bg-[#1a2332] pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <button className="text-white">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-bold text-white">All Markets</h1>
        <button className="text-white">
          <Plus className="w-6 h-6" />
        </button>
      </header>

      {/* Search Bar and Filter */}
      <div className="px-6 py-4 space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search markets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#2a3544] text-white pl-10 pr-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCategoryFilter(!showCategoryFilter)}
            className="flex items-center gap-2 bg-[#2a3544] text-white px-4 py-2 rounded-lg hover:bg-[#3a4554] transition-colors"
          >
            <Filter className="w-4 h-4" />
            <span className="text-sm">{selectedCategory || "All Categories"}</span>
          </button>
          {selectedCategory && (
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-xs text-gray-400 hover:text-white transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {showCategoryFilter && (
          <div className="bg-[#2a3544] rounded-lg p-2 space-y-1">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category)
                  setShowCategoryFilter(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedCategory === category ? "bg-blue-500 text-white" : "text-gray-300 hover:bg-[#3a4554]"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Markets List */}
      <div className="px-6 space-y-6">
        {Object.entries(groupedMarkets).map(([category, markets]) => (
          <div key={category}>
            <h2 className="text-sm font-semibold text-gray-400 mb-3 uppercase tracking-wide">{category}</h2>
            <div className="space-y-3">
              {markets.map((market) => (
                <MarketListCard key={market.id} market={market} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a2332] border-t border-white/10 px-6 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <Star className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">Featured</span>
          </Link>
          <button className="flex flex-col items-center gap-0.5">
            <List className="w-5 h-5 text-blue-500 fill-blue-500" />
            <span className="text-[10px] text-blue-500 font-medium">All Markets</span>
          </button>
          <Link href="/custom-markets" className="flex flex-col items-center gap-0.5">
            <PlusCircle className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">My Markets</span>
          </Link>
          <Link href="/profile" className="flex flex-col items-center gap-0.5">
            <User className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">Profile</span>
          </Link>
        </div>
      </nav>
    </div>
  )
}

function MarketListCard({ market }: { market: Market }) {
  const [selectedVote, setSelectedVote] = useState<"yes" | "no" | null>(null)

  const isPositive = market.percentage?.startsWith("+")
  const isNegative = market.percentage?.startsWith("-")

  return (
    <div className="bg-[#2a3544] rounded-xl p-4 flex items-center gap-4">
      {/* Icon */}
      <div className="flex-shrink-0">
        <img src={market.icon || "/placeholder.svg"} alt={market.title} className="w-16 h-16 rounded-lg object-cover" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{market.title}</h3>
        <p className="text-gray-400 text-xs mb-2 line-clamp-1">{market.description}</p>

        {market.value && (
          <div className="flex items-center gap-2 mb-2">
            <span className="text-white font-bold text-sm">{market.value}</span>
            <span
              className={`text-xs font-medium ${
                isPositive ? "text-green-500" : isNegative ? "text-red-500" : "text-gray-400"
              }`}
            >
              {market.percentage}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSelectedVote(selectedVote === "yes" ? null : "yes")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              selectedVote === "yes"
                ? "bg-green-500 text-white shadow-lg shadow-green-500/50"
                : "bg-green-500/20 text-green-500 hover:bg-green-500/30"
            }`}
          >
            Yes
          </button>
          <button
            onClick={() => setSelectedVote(selectedVote === "no" ? null : "no")}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
              selectedVote === "no"
                ? "bg-red-500 text-white shadow-lg shadow-red-500/50"
                : "bg-red-500/20 text-red-500 hover:bg-red-500/30"
            }`}
          >
            No
          </button>
        </div>
      </div>

      <div className="flex-shrink-0">
        <div className="relative w-12 h-12">
          <svg className="w-12 h-12 -rotate-90">
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              className="text-gray-700"
            />
            <circle
              cx="24"
              cy="24"
              r="20"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
              strokeDasharray={`${2 * Math.PI * 20}`}
              strokeDashoffset={`${2 * Math.PI * 20 * (1 - market.probability / 100)}`}
              className={market.probability >= 50 ? "text-green-500" : "text-red-500"}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-[11px] font-bold">{market.probability}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
