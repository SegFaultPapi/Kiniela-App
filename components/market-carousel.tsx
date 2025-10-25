"use client"

import { useEffect, useRef, useState } from "react"
import { MarketCard } from "./market-card"

interface Market {
  id: string
  image: string
  percentage: number
  title: string
  volume: string
  playerName?: string
  playerSubtext?: string
  isTactical?: boolean
}

interface MarketCarouselProps {
  markets: Market[]
  onMarketClick?: (id: string) => void
}

export function MarketCarousel({ markets, onMarketClick }: MarketCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isScrolling, setIsScrolling] = useState(false)

  // Ensure all markets have IDs (generate from title if missing)
  const marketsWithIds = markets.map((market, index) => ({
    ...market,
    id: market.id || `market-${market.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${index}`
  }))

  // Create infinite loop by duplicating markets
  const loopedMarkets = [...marketsWithIds, ...marketsWithIds, ...marketsWithIds]

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const cardWidth = 220 + 20 // card width + gap
    const containerWidth = container.clientWidth

    // Start at the middle set of markets for infinite scroll
    const startPosition = marketsWithIds.length * cardWidth
    container.scrollLeft = startPosition

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      
      // Calculate which card is most visible in the center of the viewport
      const viewportCenter = scrollLeft + containerWidth / 2
      const cardIndex = Math.floor(viewportCenter / cardWidth)
      
      // Map to original market index
      const originalIndex = cardIndex % marketsWithIds.length
      setActiveIndex(originalIndex)

      // Handle infinite scroll transitions
      const totalWidth = loopedMarkets.length * cardWidth
      const threshold = cardWidth

      if (scrollLeft < threshold) {
        // Near the beginning, jump to the end of the middle set
        container.scrollLeft = marketsWithIds.length * cardWidth + scrollLeft
      } else if (scrollLeft > totalWidth - containerWidth - threshold) {
        // Near the end, jump to the beginning of the middle set
        container.scrollLeft = marketsWithIds.length * cardWidth + (scrollLeft - (marketsWithIds.length * cardWidth))
      }
    }

    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [marketsWithIds.length, loopedMarkets.length])

  return (
    <div className="relative">
      {/* Carousel Container */}
      <div
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto py-2 pb-4 -mx-4 px-4 scrollbar-hide snap-x snap-mandatory"
        style={{ 
          scrollBehavior: "smooth"
        }}
      >
        {loopedMarkets.map((market, index) => {
          const originalIndex = index % marketsWithIds.length
          const isActive = originalIndex === activeIndex
          return (
            <div
              key={`${originalIndex}-${Math.floor(index / marketsWithIds.length)}`}
              className="snap-center transition-all duration-300 ease-out flex-shrink-0"
              style={{
                transform: isActive ? "scale(1.02)" : "scale(0.98)",
                opacity: isActive ? 1 : 0.8,
              }}
            >
              <MarketCard 
                {...market} 
                onClick={() => onMarketClick?.(market.id)}
              />
            </div>
          )
        })}
      </div>

    </div>
  )
}

