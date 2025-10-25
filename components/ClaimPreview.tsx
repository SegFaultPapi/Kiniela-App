'use client'

import { useState } from 'react'
import { Trophy, DollarSign, AlertTriangle, CheckCircle, XCircle, Loader2, ExternalLink } from 'lucide-react'
import { ClaimablePosition, ClaimState, formatClaimAmount, formatGasFee } from '@/hooks/useClaimWinnings'

interface ClaimPreviewProps {
  position: ClaimablePosition
  claimState: ClaimState
  error: string | null
  onClaim: () => void
  onRetry: () => void
  onCancel: () => void
}

export function ClaimPreview({ 
  position, 
  claimState, 
  error, 
  onClaim, 
  onRetry, 
  onCancel 
}: ClaimPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const netAmount = position.claimableAmount - position.gasFee
  const isProfitable = netAmount > 0
  const isGasWarning = position.gasFee >= position.claimableAmount * 0.1 // Gas > 10% of claim

  const getButtonContent = () => {
    switch (claimState) {
      case 'estimating':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Estimating Gas...</span>
          </>
        )
      case 'confirming':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Confirming...</span>
          </>
        )
      case 'pending':
        return (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing Claim...</span>
          </>
        )
      case 'success':
        return (
          <>
            <CheckCircle className="w-4 h-4 text-green-400" />
            <span>Claim Successful!</span>
          </>
        )
      case 'error':
        return (
          <>
            <XCircle className="w-4 h-4 text-red-400" />
            <span>Claim Failed</span>
          </>
        )
      default:
        return (
          <>
            <Trophy className="w-4 h-4" />
            <span>Claim Winnings - {formatClaimAmount(position.claimableAmount)}</span>
          </>
        )
    }
  }

  const getButtonClass = () => {
    const baseClass = "w-full py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
    
    switch (claimState) {
      case 'success':
        return `${baseClass} bg-green-600 text-white cursor-default`
      case 'error':
        return `${baseClass} bg-red-600 hover:bg-red-500 text-white`
      case 'estimating':
      case 'confirming':
      case 'pending':
        return `${baseClass} bg-blue-600 text-white cursor-not-allowed opacity-75`
      default:
        return `${baseClass} bg-green-600 hover:bg-green-500 text-white`
    }
  }

  const isButtonDisabled = claimState === 'estimating' || claimState === 'confirming' || claimState === 'pending' || claimState === 'success'

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-green-600/20 rounded-full flex items-center justify-center">
            <Trophy className="w-5 h-5 text-green-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white">🏆 You Won!</h3>
            <p className="text-sm text-gray-400">{position.marketTitle}</p>
          </div>
        </div>
        
        {/* Resolution Info */}
        <div className="flex items-center gap-2 text-sm">
          <span className="text-gray-400">Resolution:</span>
          <span className={`font-medium ${position.resolution === 'yes' ? 'text-green-400' : 'text-red-400'}`}>
            {position.resolution.toUpperCase()}
          </span>
          <span className="text-gray-400">• Your position:</span>
          <span className="font-medium text-blue-400">
            {position.userSide.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Claim Amount Breakdown */}
      <div className="p-4">
        <div className="space-y-3">
          {/* Shares Info */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Your shares:</span>
            <span className="text-white font-medium">{position.shares.toFixed(1)}</span>
          </div>
          
          {/* Final Price */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Final price:</span>
            <span className="text-white font-medium">{formatClaimAmount(position.finalPrice)}</span>
          </div>
          
          {/* Gross Amount */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Gross amount:</span>
            <span className="text-white font-medium">{formatClaimAmount(position.claimableAmount)}</span>
          </div>
          
          {/* Gas Fee */}
          <div className="flex justify-between items-center">
            <span className="text-gray-400">Gas fee:</span>
            <span className="text-gray-300">{formatGasFee(position.gasFee)}</span>
          </div>
          
          {/* Net Amount */}
          <div className="flex justify-between items-center pt-2 border-t border-gray-700">
            <span className="text-white font-medium">Net amount:</span>
            <span className={`font-bold text-lg ${isProfitable ? 'text-green-400' : 'text-red-400'}`}>
              {formatClaimAmount(netAmount)}
            </span>
          </div>
        </div>

        {/* Gas Warning */}
        {isGasWarning && (
          <div className="mt-3 p-3 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-400 text-sm font-medium">High Gas Fee</span>
            </div>
            <p className="text-yellow-300 text-xs mt-1">
              Gas fee is {((position.gasFee / position.claimableAmount) * 100).toFixed(1)}% of your winnings. 
              Consider claiming during lower network activity.
            </p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-3 p-3 bg-red-600/10 border border-red-600/30 rounded-lg">
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-red-400 text-sm font-medium">Claim Failed</span>
            </div>
            <p className="text-red-300 text-xs mt-1">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {claimState === 'success' && (
          <div className="mt-3 p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-medium">Claim Successful!</span>
            </div>
            <p className="text-green-300 text-xs mt-1">
              {formatClaimAmount(position.claimableAmount)} USDC has been added to your wallet.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-4 space-y-2">
          {/* Main Claim Button */}
          <button
            onClick={claimState === 'error' ? onRetry : onClaim}
            disabled={isButtonDisabled}
            className={getButtonClass()}
          >
            {getButtonContent()}
          </button>

          {/* Cancel Button (only show when not in final states) */}
          {(claimState === 'available' || claimState === 'error') && (
            <button
              onClick={onCancel}
              className="w-full py-2 px-4 rounded-lg font-medium text-gray-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
          )}
        </div>

        {/* Expandable Details */}
        <div className="mt-4">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between text-sm text-gray-400 hover:text-white transition-colors"
          >
            <span>Transaction Details</span>
            <span className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {isExpanded && (
            <div className="mt-2 p-3 bg-gray-700/50 rounded-lg space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Market ID:</span>
                <span className="text-gray-300 font-mono">{position.marketId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Position ID:</span>
                <span className="text-gray-300 font-mono">{position.positionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Resolved at:</span>
                <span className="text-gray-300">
                  {new Date(position.resolvedAt).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Network:</span>
                <span className="text-gray-300">Base</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
