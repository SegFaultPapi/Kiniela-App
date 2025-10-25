"use client"

import { MarketCarousel } from "@/components/market-carousel"
import { TrendingCard } from "@/components/trending-card"
import { MobileLayout } from "@/components/MobileLayout"
import { sdk } from '@farcaster/miniapp-sdk'
import { useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { sortByActivity } from "@/lib/market-utils"

// KIN-002: Market type with complete data
interface FeaturedMarket {
  id: string
  image: string
  title: string
  percentage: number
  volume: string
  playerName?: string
  playerSubtext?: string
  isTactical?: boolean
  // KIN-002: Additional data for functionality
  poolTotal: number
  closesAt: string
  lastBetAt: string
  yesPercent: number
  noPercent: number
  category: string
}

export default function Home() {
  const router = useRouter()

  // Ensure ready() is called as soon as possible
  useEffect(() => {
    sdk.actions.ready()
  }, [])

  // KIN-002: Markets con datos completos pero manteniendo estructura visual
  const soccerMarkets: FeaturedMarket[] = [
    {
      id: "soccer-1",
      image: "/placeholder.svg?height=400&width=600",
      percentage: 68,
      title: "Real Madrid vs. FC Barcelona",
      volume: "12.5k",
      playerName: "OLINI NATOIAL",
      playerSubtext: "SAFFES ACCAN ASTIGBAL",
      poolTotal: 12500,
      closesAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      lastBetAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      yesPercent: 68,
      noPercent: 32,
      category: "Sports",
    },
    {
      id: "soccer-2",
      image: "/placeholder.svg?height=400&width=600",
      percentage: 72,
      title: "Man. United vs. Liverpool",
      volume: "10.1k",
      isTactical: true,
      poolTotal: 10100,
      closesAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      lastBetAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      yesPercent: 72,
      noPercent: 28,
      category: "Sports",
    },
    {
      id: "soccer-3",
      image: "/placeholder.svg?height=400&width=600",
      percentage: 65,
      title: "PSG vs. Bayern Munich",
      volume: "11.3k",
      poolTotal: 11300,
      closesAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      lastBetAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      yesPercent: 65,
      noPercent: 35,
      category: "Sports",
    },
    {
      id: "soccer-4",
      image: "/placeholder.svg?height=400&width=600",
      percentage: 58,
      title: "Chelsea vs. Arsenal",
      volume: "9.8k",
      poolTotal: 9800,
      closesAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      lastBetAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      yesPercent: 58,
      noPercent: 42,
      category: "Sports",
    },
    {
      id: "soccer-5",
      image: "/placeholder.svg?height=400&width=600",
      percentage: 71,
      title: "Juventus vs. AC Milan",
      volume: "8.9k",
      poolTotal: 8900,
      closesAt: new Date(Date.now() + 18 * 60 * 60 * 1000).toISOString(),
      lastBetAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      yesPercent: 71,
      noPercent: 29,
      category: "Sports",
    },
  ]

  const basketballMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 55,
      title: "Lakers vs. Celtics",
      volume: "8.2k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 61,
      title: "Warriors vs. Nets",
      volume: "7.9k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 63,
      title: "Bucks vs. Heat",
      volume: "7.5k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 59,
      title: "Suns vs. Mavericks",
      volume: "6.8k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 67,
      title: "76ers vs. Knicks",
      volume: "7.1k",
    },
  ]

  const tennisMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 51,
      title: "Serena Williams vs. Naomi Osaka",
      volume: "5.7k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 48,
      title: "Federer vs. Nadal",
      volume: "9.8k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 54,
      title: "Djokovic vs. Murray",
      volume: "8.4k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 62,
      title: "Alcaraz vs. Medvedev",
      volume: "6.9k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 56,
      title: "Swiatek vs. Sabalenka",
      volume: "5.3k",
    },
  ]

  const footballMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 64,
      title: "Chiefs vs. Bills",
      volume: "11.2k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 58,
      title: "Cowboys vs. Eagles",
      volume: "10.5k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 71,
      title: "49ers vs. Rams",
      volume: "9.7k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 66,
      title: "Packers vs. Vikings",
      volume: "8.9k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 59,
      title: "Patriots vs. Dolphins",
      volume: "8.3k",
    },
  ]

  const baseballMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 52,
      title: "Yankees vs. Red Sox",
      volume: "7.8k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 61,
      title: "Dodgers vs. Giants",
      volume: "7.2k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 57,
      title: "Astros vs. Rangers",
      volume: "6.5k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 63,
      title: "Braves vs. Mets",
      volume: "6.1k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 55,
      title: "Cubs vs. Cardinals",
      volume: "5.9k",
    },
  ]

  const hockeyMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 68,
      title: "Maple Leafs vs. Canadiens",
      volume: "6.8k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 54,
      title: "Rangers vs. Bruins",
      volume: "6.3k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 62,
      title: "Penguins vs. Capitals",
      volume: "5.7k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 59,
      title: "Lightning vs. Panthers",
      volume: "5.4k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 65,
      title: "Avalanche vs. Golden Knights",
      volume: "5.1k",
    },
  ]

  const politicsMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 62,
      title: "Will Biden win 2024 election?",
      volume: "18.5k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 58,
      title: "Democrats control Senate after 2024?",
      volume: "15.2k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 71,
      title: "Supreme Court expands in 2024?",
      volume: "12.8k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 54,
      title: "EU passes new climate law?",
      volume: "9.3k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 48,
      title: "UN Security Council reform?",
      volume: "7.6k",
    },
  ]

  const economyMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 67,
      title: "S&P 500 reaches 6000 by year end?",
      volume: "22.4k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 73,
      title: "Fed cuts rates in Q2 2024?",
      volume: "19.7k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 59,
      title: "Bitcoin above $100k in 2024?",
      volume: "16.9k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 52,
      title: "Oil prices exceed $100/barrel?",
      volume: "14.3k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 64,
      title: "US inflation below 2% by Q4?",
      volume: "13.1k",
    },
  ]

  const entertainmentMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 71,
      title: "Oppenheimer wins Best Picture?",
      volume: "11.8k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 68,
      title: "Taylor Swift wins Album of Year?",
      volume: "10.5k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 55,
      title: "Dune 2 grosses over $500M?",
      volume: "9.2k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 62,
      title: "Netflix gains 10M+ subscribers?",
      volume: "8.7k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 58,
      title: "GTA 6 releases in 2024?",
      volume: "15.4k",
    },
  ]

  const technologyMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 76,
      title: "GPT-5 launches in 2024?",
      volume: "20.3k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 69,
      title: "Apple releases foldable iPhone?",
      volume: "17.6k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 54,
      title: "Tesla Cybertruck sells 100k units?",
      volume: "14.9k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 61,
      title: "SpaceX reaches Mars in 2024?",
      volume: "12.2k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 48,
      title: "Quantum computing breakthrough?",
      volume: "9.8k",
    },
  ]

  // KIN-002 AC-001: Ordenar markets de soccer por actividad
  const sortedSoccerMarkets = useMemo(() => {
    return sortByActivity(soccerMarkets)
  }, [])

  return (
    <MobileLayout showQuickActions={true} activeTab="featured">
      {/* Primary CTA Section - Keep visible near top */}
      <section className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Featured Markets</h2>
        <TrendingCard />
      </section>

      {/* KIN-002: Sports section with activity-based sorting */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">⚽ Sports</h3>
          <button 
            onClick={() => router.push('/all-markets?category=sports')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={sortedSoccerMarkets} />
      </section>

      {/* Markets Sections - Optimized spacing */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Politics</h3>
          <button 
            onClick={() => router.push('/all-markets?category=politics')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={politicsMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Economy</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={economyMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Technology</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={technologyMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Entertainment</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={entertainmentMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Basketball</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={basketballMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Tennis</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={tennisMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">American Football</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={footballMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Baseball</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={baseballMarkets} />
      </section>

      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white">Hockey</h3>
          <button 
            onClick={() => router.push('/all-markets')}
            className="text-blue-400 text-sm font-medium touch-target px-2 py-1 hover:text-blue-300 transition-colors"
          >
            See All →
          </button>
        </div>
        <MarketCarousel markets={hockeyMarkets} />
      </section>
    </MobileLayout>
  )
}