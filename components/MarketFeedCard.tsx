// KIN-002 AC-002: Market Feed Card Component
'use client'

import { Clock } from "lucide-react"
import { formatUSDC, formatTimeRemaining, isClosingSoon } from "@/lib/market-utils"

export interface MarketFeedCardProps {
  id: string
  title: string
  yesPercent: number
  noPercent: number
  poolTotal: number
  closesAt: string
  category: string
  status: 'active' | 'closing_soon' | 'closed' | 'resolved'
  image?: string // Imagen pequeña opcional
  onClick?: () => void
}

export function MarketFeedCard({
  id,
  title,
  yesPercent,
  noPercent,
  poolTotal,
  closesAt,
  category,
  status,
  image,
  onClick
}: MarketFeedCardProps) {
  const timeRemaining = formatTimeRemaining(closesAt)
  const isClosing = isClosingSoon(closesAt)
  
  return (
    <div 
      onClick={onClick}
      className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:bg-gray-750 transition-all duration-200 cursor-pointer active:scale-[0.98] touch-target"
    >
      <div className="flex gap-3">
        {/* Image thumbnail - small size */}
        {image && (
          <div className="flex-shrink-0">
            <img 
              src={image} 
              alt={title}
              className="w-16 h-16 rounded-lg object-cover"
            />
          </div>
        )}
        
        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Title - AC-002: Max 120 chars with truncation */}
          <h4 className="text-white font-medium text-base line-clamp-2 mb-3">
            {title.length > 120 ? `${title.slice(0, 120)}...` : title}
          </h4>
      
      {/* Odds Visualization - AC-002: YES/NO percentages with progress bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-green-400 font-medium">YES {yesPercent}%</span>
          <span className="text-red-400 font-medium">NO {noPercent}%</span>
        </div>
        <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
          <div 
            className="bg-green-500 transition-all duration-300" 
            style={{ width: `${yesPercent}%` }}
          ></div>
          <div 
            className="bg-red-500 transition-all duration-300" 
            style={{ width: `${noPercent}%` }}
          ></div>
        </div>
      </div>
      
      {/* Pool and Time - AC-002: Formatted information */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Pool total */}
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-400">Pool:</span>
            <span className="text-xs font-medium text-white">
              {formatUSDC(poolTotal)} USDC
            </span>
          </div>
          
          {/* Time remaining - AC-002: Visual indicator if closing soon */}
          <div className={`flex items-center gap-1 ${isClosing ? 'text-yellow-400' : 'text-gray-400'}`}>
            <Clock className="w-3 h-3" />
            <span className="text-xs font-medium">{timeRemaining}</span>
          </div>
        </div>
        
        {/* Category tag */}
        <span className="text-xs px-2 py-1 bg-blue-600/20 text-blue-400 rounded">
          {category}
        </span>
      </div>
      
          {/* Closing soon indicator - AC-002 */}
          {isClosing && (
            <div className="mt-2 pt-2 border-t border-yellow-600/30">
              <div className="flex items-center gap-2 text-yellow-400">
                <span className="text-xs font-medium">⚠️ Closing soon</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

