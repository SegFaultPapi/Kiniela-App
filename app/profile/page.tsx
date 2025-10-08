"use client"

import { ArrowLeft, Share2, Star, List, User, PlusCircle } from "lucide-react"
import Link from "next/link"

interface Position {
  id: string
  icon: string
  vote: "YES" | "NO"
  title: string
  pnl: number
  status: "open" | "closed"
}

export default function ProfilePage() {
  const positions: Position[] = [
    {
      id: "1",
      icon: "/placeholder.svg?height=80&width=80",
      vote: "YES",
      title: "Will ETH be above $3,000 on Dec 31, 2024?",
      pnl: 120,
      status: "open",
    },
    {
      id: "2",
      icon: "/placeholder.svg?height=80&width=80",
      vote: "NO",
      title: "Will BTC be above $50,000 on Dec 31, 2024?",
      pnl: -50,
      status: "open",
    },
    {
      id: "3",
      icon: "/placeholder.svg?height=80&width=80",
      vote: "YES",
      title: "Will SOL be above $100 on Dec 31, 2024?",
      pnl: 80,
      status: "open",
    },
    {
      id: "4",
      icon: "/placeholder.svg?height=80&width=80",
      vote: "YES",
      title: "Will ETH be above $2,500 on Dec 31, 2023?",
      pnl: 200,
      status: "closed",
    },
    {
      id: "5",
      icon: "/placeholder.svg?height=80&width=80",
      vote: "NO",
      title: "Will BTC be above $40,000 on Dec 31, 2023?",
      pnl: -100,
      status: "closed",
    },
  ]

  const openPositions = positions.filter((p) => p.status === "open")
  const closedPositions = positions.filter((p) => p.status === "closed")

  const totalPnL = positions.reduce((sum, p) => sum + p.pnl, 0)
  const openPnL = openPositions.reduce((sum, p) => sum + p.pnl, 0)

  return (
    <div className="min-h-screen bg-[#1a2332] pb-20">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-white/10">
        <Link href="/" className="text-white">
          <ArrowLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-white">Positions</h1>
        <div className="w-6" />
      </header>

      {/* Stats Dashboard */}
      <div className="px-6 py-6 space-y-4">
        <div className="bg-[#2a3544] rounded-xl p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-gray-400 text-xs mb-1">Total P&L</p>
              <p className={`text-xl font-bold ${totalPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {totalPnL >= 0 ? "+" : ""}${totalPnL}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Open P&L</p>
              <p className={`text-xl font-bold ${openPnL >= 0 ? "text-green-500" : "text-red-500"}`}>
                {openPnL >= 0 ? "+" : ""}${openPnL}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs mb-1">Markets</p>
              <p className="text-xl font-bold text-white">{positions.length}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#2a3544] rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Win Rate</p>
            <p className="text-2xl font-bold text-white">67%</p>
          </div>
          <div className="bg-[#2a3544] rounded-xl p-4">
            <p className="text-gray-400 text-xs mb-1">Total Volume</p>
            <p className="text-2xl font-bold text-white">$2.4k</p>
          </div>
        </div>
      </div>

      {/* Open Positions */}
      <div className="px-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Open</h2>
        <div className="space-y-3">
          {openPositions.map((position) => (
            <PositionCard key={position.id} position={position} />
          ))}
        </div>
      </div>

      {/* Closed Positions */}
      <div className="px-6 mb-6">
        <h2 className="text-2xl font-bold text-white mb-4">Closed</h2>
        <div className="space-y-3">
          {closedPositions.map((position) => (
            <PositionCard key={position.id} position={position} showShare />
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#1a2332] border-t border-white/10 px-6 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          <Link href="/" className="flex flex-col items-center gap-0.5">
            <Star className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">Featured</span>
          </Link>
          <Link href="/all-markets" className="flex flex-col items-center gap-0.5">
            <List className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">All Markets</span>
          </Link>
          <Link href="/custom-markets" className="flex flex-col items-center gap-0.5">
            <PlusCircle className="w-5 h-5 text-gray-400" />
            <span className="text-[10px] text-gray-400">My Markets</span>
          </Link>
          <button className="flex flex-col items-center gap-0.5">
            <User className="w-5 h-5 text-blue-500 fill-blue-500" />
            <span className="text-[10px] text-blue-500 font-medium">Profile</span>
          </button>
        </div>
      </nav>
    </div>
  )
}

function PositionCard({
  position,
  showShare = false,
}: {
  position: Position
  showShare?: boolean
}) {
  return (
    <div className="bg-[#2a3544] rounded-xl p-4 flex items-center gap-4">
      {/* Icon */}
      <div className="flex-shrink-0">
        <img
          src={position.icon || "/placeholder.svg"}
          alt={position.title}
          className="w-16 h-16 rounded-lg object-cover"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`text-xs font-bold px-2 py-0.5 rounded ${
              position.vote === "YES" ? "bg-green-500/20 text-green-500" : "bg-red-500/20 text-red-500"
            }`}
          >
            {position.vote}
          </span>
        </div>
        <p className="text-white text-sm line-clamp-2">{position.title}</p>
      </div>

      {/* P&L and Share */}
      <div className="flex-shrink-0 flex items-center gap-3">
        <span className={`text-lg font-bold ${position.pnl >= 0 ? "text-green-500" : "text-red-500"}`}>
          {position.pnl >= 0 ? "+" : ""}${position.pnl}
        </span>
        {showShare && (
          <button className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center hover:bg-blue-600 transition-colors">
            <Share2 className="w-5 h-5 text-white" />
          </button>
        )}
      </div>
    </div>
  )
}
