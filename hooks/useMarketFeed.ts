// KIN-002: Market Feed Hook with API-ready structure
'use client'

import { useState, useCallback, useEffect } from 'react'

// Market types
export type MarketStatus = 'active' | 'closing_soon' | 'closed' | 'resolved'

export interface Market {
  id: string
  title: string
  description?: string
  yesPercent: number
  noPercent: number
  poolTotal: number
  closesAt: string
  category: string
  subcategory?: string
  status: MarketStatus
  createdBy?: string
  totalBets?: number
  lastBetAt: string
  image?: string
}

export interface FeedResponse {
  markets: Market[]
  nextCursor?: string
  hasMore: boolean
  totalCount: number
}

interface UseMarketFeedOptions {
  limit?: number
  sortBy?: 'activity' | 'pool' | 'recent'
  status?: MarketStatus | 'all'
  refetchInterval?: number // milliseconds
}

interface UseMarketFeedReturn {
  markets: Market[]
  isLoading: boolean
  isLoadingMore: boolean
  error: string | null
  hasMore: boolean
  fetchMore: () => Promise<void>
  refresh: () => Promise<void>
  totalCount: number
}

// Mock data generator
const generateMockMarkets = (page: number, limit: number): FeedResponse => {
  const allMarkets: Market[] = [
    {
      id: "1",
      title: "Will Real Madrid beat FC Barcelona?",
      yesPercent: 68,
      noPercent: 32,
      poolTotal: 12500,
      closesAt: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(),
      category: "Sports",
      subcategory: "Football",
      status: 'closing_soon',
      lastBetAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      image: "/kiniela_logo.png",
      totalBets: 142
    },
    {
      id: "2",
      title: "Will Bitcoin reach $100,000 this year?",
      yesPercent: 45,
      noPercent: 55,
      poolTotal: 28900,
      closesAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Crypto",
      subcategory: "Bitcoin",
      status: 'active',
      lastBetAt: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      image: "/kiniela_logo.png",
      totalBets: 289
    },
    {
      id: "3",
      title: "Will electoral reform be approved?",
      yesPercent: 52,
      noPercent: 48,
      poolTotal: 8700,
      closesAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Politics",
      subcategory: "Elections",
      status: 'active',
      lastBetAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      image: "/kiniela_logo.png",
      totalBets: 87
    },
    // Add more markets as needed...
  ]

  const start = page * limit
  const end = start + limit
  const pageMarkets = allMarkets.slice(start, end)

  return {
    markets: pageMarkets,
    nextCursor: end < allMarkets.length ? `page_${page + 1}` : undefined,
    hasMore: end < allMarkets.length,
    totalCount: allMarkets.length
  }
}

// Simulated API call
const fetchMarketsAPI = async (
  page: number,
  limit: number,
  options: UseMarketFeedOptions
): Promise<FeedResponse> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500))

  // Simulate occasional errors (5% chance)
  if (Math.random() < 0.05) {
    throw new Error('Network error: Failed to fetch markets')
  }

  // In production, this would be:
  // const response = await fetch(`/api/markets?page=${page}&limit=${limit}&sort=${options.sortBy}`)
  // return response.json()

  return generateMockMarkets(page, limit)
}

/**
 * Hook for fetching market feed with infinite scroll
 * Ready for API integration - just replace fetchMarketsAPI with real API call
 */
export function useMarketFeed(options: UseMarketFeedOptions = {}): UseMarketFeedReturn {
  const {
    limit = 20,
    sortBy = 'activity',
    status = 'active',
    refetchInterval = 30000 // 30 seconds
  } = options

  const [markets, setMarkets] = useState<Market[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [totalCount, setTotalCount] = useState(0)

  // Initial load
  const loadInitial = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetchMarketsAPI(0, limit, { sortBy, status })
      setMarkets(response.markets)
      setHasMore(response.hasMore)
      setTotalCount(response.totalCount)
      setCurrentPage(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load markets')
      setMarkets([])
    } finally {
      setIsLoading(false)
    }
  }, [limit, sortBy, status])

  // Load more (for infinite scroll)
  const fetchMore = useCallback(async () => {
    if (isLoadingMore || !hasMore) return

    setIsLoadingMore(true)
    setError(null)

    try {
      const nextPage = currentPage + 1
      const response = await fetchMarketsAPI(nextPage, limit, { sortBy, status })
      
      setMarkets(prev => [...prev, ...response.markets])
      setHasMore(response.hasMore)
      setCurrentPage(nextPage)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more markets')
    } finally {
      setIsLoadingMore(false)
    }
  }, [currentPage, limit, sortBy, status, hasMore, isLoadingMore])

  // Refresh (manual or auto)
  const refresh = useCallback(async () => {
    setError(null)

    try {
      const response = await fetchMarketsAPI(0, limit * (currentPage + 1), { sortBy, status })
      setMarkets(response.markets)
      setHasMore(response.hasMore)
      setTotalCount(response.totalCount)
      setCurrentPage(0)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh markets')
    }
  }, [limit, currentPage, sortBy, status])

  // Initial load on mount
  useEffect(() => {
    loadInitial()
  }, [loadInitial])

  // Auto-refresh interval
  useEffect(() => {
    if (!refetchInterval || refetchInterval <= 0) return

    const intervalId = setInterval(() => {
      console.log('⏰ Auto-refreshing market feed...')
      refresh()
    }, refetchInterval)

    return () => clearInterval(intervalId)
  }, [refresh, refetchInterval])

  return {
    markets,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    fetchMore,
    refresh,
    totalCount
  }
}

