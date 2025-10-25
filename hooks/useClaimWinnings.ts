'use client'

import { useState, useCallback, useMemo } from 'react'
import { useAccount } from 'wagmi'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

// Types for claimable positions
export interface ClaimablePosition {
  marketId: string
  positionId: string
  marketTitle: string
  shares: number
  finalPrice: number // 1.0 for winner, 0.0 for loser
  claimableAmount: number
  gasFee: number
  alreadyClaimed: boolean
  resolution: 'yes' | 'no'
  userSide: 'yes' | 'no'
  resolvedAt: string
  marketImage?: string
}

export interface ClaimHistory {
  id: string
  marketId: string
  marketTitle: string
  amount: number
  claimedAt: string
  transactionHash: string
  marketImage?: string
}

export type ClaimState = 
  | 'available'    // Ready to claim
  | 'estimating'   // Getting gas estimate  
  | 'confirming'   // User confirming
  | 'pending'      // Transaction submitted
  | 'success'      // Claim successful
  | 'error'        // Something failed

// Mock data for demonstration
const MOCK_CLAIMABLE_POSITIONS: ClaimablePosition[] = [
  {
    marketId: "1",
    positionId: "pos-1",
    marketTitle: "Will Argentina win Copa América 2026?",
    shares: 45.2,
    finalPrice: 1.0, // Won
    claimableAmount: 67.80,
    gasFee: 0.02,
    alreadyClaimed: false,
    resolution: 'yes',
    userSide: 'yes',
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    marketImage: "/kiniela_logo.png"
  },
  {
    marketId: "soccer-1",
    positionId: "pos-2",
    marketTitle: "Will Messi score 20+ goals in MLS 2026?",
    shares: 23.1,
    finalPrice: 1.0, // Won
    claimableAmount: 34.65,
    gasFee: 0.02,
    alreadyClaimed: false,
    resolution: 'yes',
    userSide: 'yes',
    resolvedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
    marketImage: "/kiniela_logo.png"
  }
]

const MOCK_CLAIM_HISTORY: ClaimHistory[] = [
  {
    id: "claim-1",
    marketId: "old-1",
    marketTitle: "Will Bitcoin reach $100K in 2025?",
    amount: 156.20,
    claimedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    transactionHash: "0x1234...5678",
    marketImage: "/kiniela_logo.png"
  },
  {
    id: "claim-2",
    marketId: "old-2",
    marketTitle: "Will Lakers win NBA Championship 2025?",
    amount: 89.45,
    claimedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days ago
    transactionHash: "0x5678...9abc",
    marketImage: "/kiniela_logo.png"
  }
]

// Hook for fetching claimable positions
export function useClaimablePositions() {
  const { address, isConnected } = useAccount()

  return useQuery({
    queryKey: ['positions', 'claimable', address],
    queryFn: async (): Promise<ClaimablePosition[]> => {
      if (!address || !isConnected) return []
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // In real app, this would fetch from API
      return MOCK_CLAIMABLE_POSITIONS.filter(pos => !pos.alreadyClaimed)
    },
    enabled: !!address && isConnected,
    refetchInterval: 30000, // Check every 30s for new resolved markets
    staleTime: 10000, // Consider data stale after 10s
  })
}

// Hook for fetching claim history
export function useClaimHistory() {
  const { address, isConnected } = useAccount()

  return useQuery({
    queryKey: ['claims', 'history', address],
    queryFn: async (): Promise<ClaimHistory[]> => {
      if (!address || !isConnected) return []
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // In real app, this would fetch from API
      return MOCK_CLAIM_HISTORY
    },
    enabled: !!address && isConnected,
    staleTime: 60000, // Consider data stale after 1 minute
  })
}

// Hook for claiming winnings
export function useClaimWinnings() {
  const { address } = useAccount()
  const queryClient = useQueryClient()
  const [claimState, setClaimState] = useState<ClaimState>('available')
  const [error, setError] = useState<string | null>(null)

  const claimMutation = useMutation({
    mutationFn: async ({ positionId, amount }: { positionId: string; amount: number }) => {
      if (!address) throw new Error('Wallet not connected')
      
      setClaimState('estimating')
      
      // Simulate gas estimation
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setClaimState('confirming')
      
      // Simulate user confirmation delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setClaimState('pending')
      
      // Simulate transaction submission
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Simulate 10% chance of failure
      if (Math.random() < 0.1) {
        throw new Error('Transaction failed: Insufficient gas')
      }
      
      return {
        transactionHash: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`,
        amount,
        success: true
      }
    },
    onSuccess: (result, { positionId, amount }) => {
      setClaimState('success')
      setError(null)
      
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: ['positions', 'claimable'] })
      queryClient.invalidateQueries({ queryKey: ['claims', 'history'] })
      queryClient.invalidateQueries({ queryKey: ['balance'] })
      
      console.log(`Successfully claimed $${amount} USDC!`, result.transactionHash)
      
      // Reset state after 3 seconds
      setTimeout(() => {
        setClaimState('available')
      }, 3000)
    },
    onError: (error: Error) => {
      setClaimState('error')
      setError(error.message)
      
      // Reset to available state after 5 seconds
      setTimeout(() => {
        setClaimState('available')
        setError(null)
      }, 5000)
    }
  })

  const claimWinnings = useCallback(async (positionId: string, amount: number) => {
    if (claimState !== 'available') return
    
    try {
      await claimMutation.mutateAsync({ positionId, amount })
    } catch (error) {
      // Error is handled by onError callback
    }
  }, [claimMutation, claimState])

  const retryClaim = useCallback(() => {
    if (claimState === 'error') {
      setClaimState('available')
      setError(null)
    }
  }, [claimState])

  // Calculate total claimable amount
  const totalClaimable = useMemo(() => {
    const claimablePositions = queryClient.getQueryData<ClaimablePosition[]>(['positions', 'claimable', address]) || []
    return claimablePositions.reduce((total, pos) => total + pos.claimableAmount, 0)
  }, [queryClient, address])

  // Calculate total claimed amount
  const totalClaimed = useMemo(() => {
    const claimHistory = queryClient.getQueryData<ClaimHistory[]>(['claims', 'history', address]) || []
    return claimHistory.reduce((total, claim) => total + claim.amount, 0)
  }, [queryClient, address])

  return {
    claimWinnings,
    retryClaim,
    claimState,
    error,
    isLoading: claimMutation.isPending,
    totalClaimable,
    totalClaimed,
    isClaiming: claimState === 'pending' || claimState === 'estimating' || claimState === 'confirming'
  }
}

// Utility function to calculate claim amount
export function calculateClaimAmount(shares: number, finalPrice: number): number {
  return shares * finalPrice
}

// Utility function to check if position is claimable
export function isPositionClaimable(position: ClaimablePosition): boolean {
  return (
    !position.alreadyClaimed &&
    position.finalPrice > 0 &&
    position.claimableAmount > 0
  )
}

// Utility function to format claim amount
export function formatClaimAmount(amount: number): string {
  return `$${amount.toFixed(2)}`
}

// Utility function to format gas fee
export function formatGasFee(fee: number): string {
  return `~$${fee.toFixed(2)}`
}
