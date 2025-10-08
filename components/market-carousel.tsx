"use client"

import { useEffect, useRef, useState } from "react"
import { MarketCard } from "./market-card"

interface Market {
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
}

export function MarketCarousel({ markets }: MarketCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const loopedMarkets = [...markets, ...markets, ...markets]

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = 232 // card width (220) + gap (12)
      const index = Math.round(scrollLeft / cardWidth)
      setActiveIndex(index % markets.length)
    }

    container.addEventListener("scroll", handleScroll)

    container.scrollLeft = markets.length * 232

    return () => container.removeEventListener("scroll", handleScroll)
  }, [markets.length])

  useEffect(() => {
    const container = scrollRef.current
    if (!container) return

    const handleScrollEnd = () => {
      const scrollLeft = container.scrollLeft
      const cardWidth = 232
      const totalWidth = cardWidth * markets.length

      // Reset to middle section when reaching edges
      if (scrollLeft < cardWidth) {
        container.scrollLeft = scrollLeft + totalWidth
      } else if (scrollLeft > totalWidth * 2 - cardWidth) {
        container.scrollLeft = scrollLeft - totalWidth
      }
    }

    let scrollTimeout: NodeJS.Timeout
    const onScroll = () => {
      clearTimeout(scrollTimeout)
      scrollTimeout = setTimeout(handleScrollEnd, 150)
    }

    container.addEventListener("scroll", onScroll)
    return () => {
      container.removeEventListener("scroll", onScroll)
      clearTimeout(scrollTimeout)
    }
  }, [markets.length])

  return (
    <div
      ref={scrollRef}
      className="flex gap-3 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide snap-x snap-mandatory"
      style={{ perspective: "1000px" }}
    >
      {loopedMarkets.map((market, index) => {
        const isActive = index % markets.length === activeIndex
        return (
          <div
            key={index}
            className="snap-center transition-all duration-300 ease-out"
            style={{
              transform: isActive ? "scale(1) translateZ(0px)" : "scale(0.85) translateZ(-50px)",
              opacity: isActive ? 1 : 0.6,
            }}
          >
            <MarketCard {...market} />
          </div>
        )
      })}
    </div>
  )
}
