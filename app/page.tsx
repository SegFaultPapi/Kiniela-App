"use client"

import { Star, List, User, PlusCircle } from "lucide-react"
import { MarketCarousel } from "@/components/market-carousel"
import { TrendingCard } from "@/components/trending-card"
import { useFarcasterSDK } from "@/components/farcaster-provider"
import Link from "next/link"

export default function Home() {
  const { user, isConnected } = useFarcasterSDK()

  const soccerMarkets = [
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 68,
      title: "Real Madrid vs. FC Barcelona",
      volume: "12.5k",
      playerName: "OLINI NATOIAL",
      playerSubtext: "SAFFES ACCAN ASTIGBAL",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 72,
      title: "Man. United vs. Liverpool",
      volume: "10.1k",
      isTactical: true,
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 65,
      title: "PSG vs. Bayern Munich",
      volume: "11.3k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 58,
      title: "Chelsea vs. Arsenal",
      volume: "9.8k",
    },
    {
      image: "/placeholder.svg?height=400&width=600",
      percentage: 71,
      title: "Juventus vs. AC Milan",
      volume: "8.9k",
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

  return (
    <div className="min-h-screen bg-[#1a2332] pb-16">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-2 border-b border-white/10">
        <div className="w-10" />
        <h1 className="text-lg font-bold text-white">Kiniela</h1>
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center">
            <div className="w-5 h-5 rounded-full bg-white" />
          </div>
          <div className="absolute top-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-[#1a2332]" />
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 pt-6">
        <h2 className="text-3xl font-bold text-white mb-6">Featured Markets</h2>

        <TrendingCard />

        {/* Politics Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Politics</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={politicsMarkets} />
        </section>

        {/* Economy Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Economy</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={economyMarkets} />
        </section>

        {/* Technology Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Technology</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={technologyMarkets} />
        </section>

        {/* Entertainment Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Entertainment</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={entertainmentMarkets} />
        </section>

        {/* Soccer Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Soccer</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={soccerMarkets} />
        </section>

        {/* Basketball Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Basketball</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={basketballMarkets} />
        </section>

        {/* Tennis Section */}
        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Tennis</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={tennisMarkets} />
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">American Football</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={footballMarkets} />
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Baseball</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={baseballMarkets} />
        </section>

        <section className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white">Hockey</h3>
            <button className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors">
              See All
            </button>
          </div>
          <MarketCarousel markets={hockeyMarkets} />
        </section>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a2332] border-t border-white/10 px-6 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <button className="flex flex-col items-center gap-0.5">
            <Star className="w-5 h-5 text-blue-500 fill-blue-500" />
            <span className="text-[10px] text-blue-500 font-medium">Featured</span>
          </button>
          <Link href="/all-markets" className="flex flex-col items-center gap-0.5">
            <List className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">All Markets</span>
          </Link>
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

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  )
}