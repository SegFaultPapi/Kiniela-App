"use client"

import { useState, useEffect } from "react"
import { Bookmark, ArrowRight } from "lucide-react"

interface Market {
  image: string
  percentage: number
  title: string
  volume: string
  category: string
  description: string
}

const featuredMarkets: Market[] = [
  {
    image: "/placeholder.svg?height=400&width=400",
    percentage: 73,
    title: "Will Bitcoin reach $150,000 by end of 2025?",
    volume: "2.8M",
    category: "Crypto",
    description:
      "Market predicting if Bitcoin will surpass $150,000 USD by December 31, 2025, based on current market trends and institutional adoption.",
  },
  {
    image: "/placeholder.svg?height=400&width=400",
    percentage: 68,
    title: "Will AGI be achieved by 2030?",
    volume: "1.9M",
    category: "Technology",
    description:
      "Prediction market on whether Artificial General Intelligence will be successfully demonstrated by major tech companies before 2030.",
  },
  {
    image: "/placeholder.svg?height=400&width=400",
    percentage: 81,
    title: "Will renewable energy exceed 50% of global production by 2028?",
    volume: "1.5M",
    category: "Environment",
    description:
      "Market forecasting if renewable energy sources will account for more than half of global electricity production by 2028.",
  },
]

export function TrendingCard() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isBookmarked, setIsBookmarked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const currentMarket = featuredMarkets[currentIndex]

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % featuredMarkets.length)
        setIsTransitioning(false)
      }, 500) // Increased transition duration from 300ms to 500ms for smoother effect
    }, 7000) // Increased interval from 5000ms to 7000ms for slower rotation

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="relative mb-6">
      <div className="relative rounded-xl overflow-hidden border border-amber-700/40 shadow-[0_0_8px_rgba(180,83,9,0.08)]">
        <div
          className={`relative aspect-[4/3] transition-opacity duration-500 ease-in-out ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          <img
            src={currentMarket.image || "/placeholder.svg"}
            alt={currentMarket.title}
            className="w-full h-full object-cover"
          />

          <div
            className="absolute top-3 left-3 z-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full shadow-lg transition-all duration-300 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div className="flex items-center gap-1.5 px-2.5 py-1">
              <span className="text-sm">🔥</span>
              <span
                className={`text-xs font-bold text-white uppercase tracking-wide transition-all duration-300 ${
                  isHovered ? "max-w-[80px] opacity-100" : "max-w-0 opacity-0"
                }`}
              >
                Trending
              </span>
            </div>
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

          <div className="absolute bottom-3 left-3 right-3">
            <span className="inline-block px-2 py-0.5 bg-blue-500/90 rounded text-xs font-medium text-white backdrop-blur-sm mb-2">
              {currentMarket.category}
            </span>
            <h3 className="text-lg font-bold text-white leading-tight">{currentMarket.title}</h3>
          </div>
        </div>

        <div
          className={`bg-[#1a2332] px-3 py-2.5 border-t border-gray-700/50 transition-opacity duration-500 ease-in-out min-h-[60px] flex items-center ${isTransitioning ? "opacity-0" : "opacity-100"}`}
        >
          <p className="text-gray-300 text-xs leading-relaxed line-clamp-2">{currentMarket.description}</p>
        </div>
      </div>

      <div className="flex gap-2 mt-3 px-1 items-center">
        <button className="flex-1 py-2.5 rounded-lg font-medium text-sm bg-blue-600 text-white hover:bg-blue-500 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/40 hover:scale-[1.02] flex items-center justify-center gap-2">
          Go To Market
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-2.5 rounded-lg transition-all duration-300 ${
            isBookmarked
              ? "bg-amber-500/20 text-amber-400"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
          }`}
        >
          <Bookmark className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 px-1">
        <p className="text-gray-400 text-xs font-medium">Volume: {currentMarket.volume}</p>
        <div className="flex gap-1">
          {featuredMarkets.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === currentIndex ? "w-5 bg-blue-500" : "w-1 bg-gray-600"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
