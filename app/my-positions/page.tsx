'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { Trophy, DollarSign, History, TrendingUp, AlertCircle } from "lucide-react"
import { useAccount } from "wagmi"
import { useClaimablePositions, useClaimHistory } from "@/hooks/useClaimWinnings"
import { ClaimablePositionsList } from "@/components/ClaimablePositionsList"
import { useState } from "react"

export default function MyPositions() {
  const { address, isConnected } = useAccount()
  const [activeTab, setActiveTab] = useState<'claimable' | 'history'>('claimable')
  
  const { data: claimablePositions = [], isLoading: isLoadingClaimable, error: claimableError } = useClaimablePositions()
  const { data: claimHistory = [], isLoading: isLoadingHistory, error: historyError } = useClaimHistory()

  // Calculate totals
  const totalClaimable = claimablePositions.reduce((total, pos) => total + pos.claimableAmount, 0)
  const totalClaimed = claimHistory.reduce((total, claim) => total + claim.amount, 0)

  // Si no está conectado, mostrar mensaje
  if (!isConnected) {
    return (
      <MobileLayout title="My Positions" activeTab="profile">
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
          <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Trophy className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-white mb-2">No Wallet Connected</h3>
          <p className="text-gray-400 mb-6">Connect your wallet to view your positions</p>
          <button
            onClick={() => window.location.href = '/'}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go to Home
          </button>
        </div>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout title="My Positions" activeTab="profile">
      {/* Header Stats */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <Trophy className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Available to Claim</span>
            </div>
            <div className="text-2xl font-bold text-green-400">
              ${totalClaimable.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {claimablePositions.length} position{claimablePositions.length !== 1 ? 's' : ''}
            </div>
          </div>
          
          <div className="bg-gray-800 rounded-lg p-4 border border-gray-700">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-400">Total Claimed</span>
            </div>
            <div className="text-2xl font-bold text-blue-400">
              ${totalClaimed.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500">
              {claimHistory.length} claim{claimHistory.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="mb-6">
        <div className="flex bg-gray-800 rounded-lg p-1">
          <button
            onClick={() => setActiveTab('claimable')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'claimable'
                ? 'bg-green-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Trophy className="w-4 h-4" />
              <span>Claimable</span>
              {claimablePositions.length > 0 && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {claimablePositions.length}
                </span>
              )}
            </div>
          </button>
          
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'history'
                ? 'bg-blue-600 text-white'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <History className="w-4 h-4" />
              <span>History</span>
              {claimHistory.length > 0 && (
                <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                  {claimHistory.length}
                </span>
              )}
            </div>
          </button>
        </div>
      </div>

      {/* Tab Content */}
      {activeTab === 'claimable' ? (
        <div>
          {/* Loading State */}
          {isLoadingClaimable && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-green-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading claimable positions...</p>
            </div>
          )}

          {/* Error State */}
          {claimableError && (
            <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Error Loading Positions</span>
              </div>
              <p className="text-red-300 text-sm mt-1">
                {claimableError.message || 'Failed to load claimable positions'}
              </p>
            </div>
          )}

          {/* Claimable Positions */}
          {!isLoadingClaimable && !claimableError && (
            <ClaimablePositionsList 
              positions={claimablePositions}
              onPositionClick={(position) => {
                console.log('Position clicked:', position.marketTitle)
              }}
            />
          )}
        </div>
      ) : (
        <div>
          {/* Loading State */}
          {isLoadingHistory && (
            <div className="text-center py-8">
              <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-400">Loading claim history...</p>
            </div>
          )}

          {/* Error State */}
          {historyError && (
            <div className="bg-red-600/10 border border-red-600/30 rounded-lg p-4 mb-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-400" />
                <span className="text-red-400 font-medium">Error Loading History</span>
              </div>
              <p className="text-red-300 text-sm mt-1">
                {historyError.message || 'Failed to load claim history'}
              </p>
            </div>
          )}

          {/* Claim History */}
          {!isLoadingHistory && !historyError && (
            <div className="space-y-4">
              {claimHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <History className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">No Claim History</h3>
                  <p className="text-gray-400 text-sm">
                    You haven't claimed any winnings yet.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {claimHistory.map((claim) => (
                    <div
                      key={claim.id}
                      className="bg-gray-800 rounded-lg border border-gray-700 p-4"
                    >
                      <div className="flex items-start gap-3">
                        {/* Market Image */}
                        {claim.marketImage && (
                          <img
                            src={claim.marketImage}
                            alt={claim.marketTitle}
                            className="w-12 h-12 rounded-lg object-cover"
                          />
                        )}
                        
                        {/* Claim Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-white font-medium truncate">{claim.marketTitle}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">Claimed:</span>
                            <span className="text-xs text-gray-300">
                              {new Date(claim.claimedAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-400">Transaction:</span>
                            <span className="text-xs text-blue-400 font-mono">
                              {claim.transactionHash.slice(0, 8)}...{claim.transactionHash.slice(-8)}
                            </span>
                          </div>
                        </div>
                        
                        {/* Amount */}
                        <div className="text-right">
                          <div className="text-lg font-bold text-green-400">
                            +${claim.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-400">USDC</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </MobileLayout>
  )
}
