'use client'

import { useState } from 'react'
import { Trophy, DollarSign, Clock, ExternalLink, CheckCircle } from 'lucide-react'
import { ClaimablePosition, formatClaimAmount, formatGasFee } from '@/hooks/useClaimWinnings'
import { ClaimPreview } from '@/components/ClaimPreview'
import { useClaimWinnings } from '@/hooks/useClaimWinnings'

interface ClaimablePositionsListProps {
  positions: ClaimablePosition[]
  onPositionClick?: (position: ClaimablePosition) => void
}

export function ClaimablePositionsList({ positions, onPositionClick }: ClaimablePositionsListProps) {
  const [selectedPosition, setSelectedPosition] = useState<ClaimablePosition | null>(null)
  const { claimWinnings, retryClaim, claimState, error } = useClaimWinnings()

  const handleClaim = async (position: ClaimablePosition) => {
    await claimWinnings(position.positionId, position.claimableAmount)
  }

  const handleRetry = () => {
    retryClaim()
  }

  const handleCancel = () => {
    setSelectedPosition(null)
  }

  const handlePositionClick = (position: ClaimablePosition) => {
    setSelectedPosition(position)
    onPositionClick?.(position)
  }

  if (positions.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Claimable Winnings</h3>
        <p className="text-gray-400 text-sm">
          You don't have any winnings to claim at the moment.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-white">🏆 Claimable Winnings</h2>
          <p className="text-gray-400 text-sm">
            {positions.length} position{positions.length !== 1 ? 's' : ''} ready to claim
          </p>
        </div>
        <div className="text-right">
          <div className="text-lg font-bold text-green-400">
            {formatClaimAmount(positions.reduce((total, pos) => total + pos.claimableAmount, 0))}
          </div>
          <div className="text-xs text-gray-400">Total Available</div>
        </div>
      </div>

      {/* Positions List */}
      <div className="space-y-3">
        {positions.map((position) => (
          <div
            key={position.positionId}
            className="bg-gray-800 rounded-lg border border-gray-700 p-4 hover:border-green-600/50 transition-colors cursor-pointer"
            onClick={() => handlePositionClick(position)}
          >
            <div className="flex items-start gap-3">
              {/* Market Image */}
              {position.marketImage && (
                <img
                  src={position.marketImage}
                  alt={position.marketTitle}
                  className="w-12 h-12 rounded-lg object-cover"
                />
              )}
              
              {/* Position Info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium truncate">{position.marketTitle}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-gray-400">Your position:</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded ${
                    position.userSide === 'yes' 
                      ? 'bg-green-600/20 text-green-400' 
                      : 'bg-red-600/20 text-red-400'
                  }`}>
                    {position.userSide.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">•</span>
                  <span className="text-xs text-gray-400">
                    {position.shares.toFixed(1)} shares
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-400">
                    Resolved {new Date(position.resolvedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              {/* Claim Amount */}
              <div className="text-right">
                <div className="text-lg font-bold text-green-400">
                  {formatClaimAmount(position.claimableAmount)}
                </div>
                <div className="text-xs text-gray-400">
                  -{formatGasFee(position.gasFee)} gas
                </div>
                <div className="text-xs text-gray-300">
                  Net: {formatClaimAmount(position.claimableAmount - position.gasFee)}
                </div>
              </div>
            </div>
            
            {/* Claim Button */}
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-green-400" />
                <span className="text-sm text-green-400 font-medium">Ready to claim</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handlePositionClick(position)
                }}
                className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span>Claim Now</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Claim Preview Modal */}
      {selectedPosition && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <ClaimPreview
              position={selectedPosition}
              claimState={claimState}
              error={error}
              onClaim={() => handleClaim(selectedPosition)}
              onRetry={handleRetry}
              onCancel={handleCancel}
            />
          </div>
        </div>
      )}
    </div>
  )
}
