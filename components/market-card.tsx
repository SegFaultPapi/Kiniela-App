"use client"

import { useState } from "react"
import { Bookmark } from "lucide-react"

interface MarketCardProps {
  image: string
  percentage: number
  title: string
  volume: string
  playerName?: string
  playerSubtext?: string
  isTactical?: boolean
  onClick?: () => void
}

export function MarketCard({
  image,
  percentage,
  title,
  volume,
  playerName,
  playerSubtext,
  isTactical,
  onClick,
}: MarketCardProps) {
  const [selectedVote, setSelectedVote] = useState<"yes" | "no" | null>(null)
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <div className="flex-shrink-0 w-[220px]">
      <div 
        className="relative rounded-xl overflow-hidden mb-2 aspect-[4/3] group cursor-pointer active:scale-95 transition-transform"
        onClick={onClick}
      >
        <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />

        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1.5">
          <svg className="w-14 h-8" viewBox="0 0 64 32">
            <path
              d="M 8 32 A 24 24 0 0 1 56 32"
              fill="none"
              stroke="rgba(255,255,255,0.2)"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M 8 32 A 24 24 0 0 1 56 32"
              fill="none"
              stroke="#10b981"
              strokeWidth="5"
              strokeDasharray={`${(percentage / 100) * 75.4} 75.4`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-end justify-center pb-1">
            <span className="text-base font-bold text-[#10b981]">{percentage}%</span>
          </div>
        </div>

        {playerName && (
          <div className="absolute bottom-3 left-3 text-white text-left">
            <p className="text-xs font-bold tracking-wide">{playerName}</p>
            <p className="text-[10px] opacity-80">{playerSubtext}</p>
          </div>
        )}
      </div>

      <div className="mb-2">
        <h4 className="text-white font-bold text-sm mb-2 line-clamp-2 leading-tight min-h-[2.5rem]">{title}</h4>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => setSelectedVote("yes")}
          className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all duration-300 ${
            selectedVote === "yes"
              ? "bg-green-500 text-white scale-105 shadow-lg shadow-green-500/40"
              : "bg-green-600/80 text-white hover:bg-green-500 hover:shadow-md hover:shadow-green-500/30 hover:scale-[1.02]"
          }`}
        >
          YES
        </button>
        <button
          onClick={() => setSelectedVote("no")}
          className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all duration-300 ${
            selectedVote === "no"
              ? "bg-red-500 text-white scale-105 shadow-lg shadow-red-500/40"
              : "bg-red-600/80 text-white hover:bg-red-500 hover:shadow-md hover:shadow-red-500/30 hover:scale-[1.02]"
          }`}
        >
          NO
        </button>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs">Volume: {volume}</p>
        <button
          onClick={() => setIsBookmarked(!isBookmarked)}
          className={`p-1.5 rounded-md transition-all duration-300 ${
            isBookmarked
              ? "bg-amber-500/20 text-amber-400"
              : "bg-gray-700/50 text-gray-400 hover:bg-gray-700 hover:text-gray-300"
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
        </button>
      </div>
    </div>
  )
}
