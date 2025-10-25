'use client'

import { MobileLayout } from "@/components/MobileLayout"
import { MarketFeedCard } from "@/components/MarketFeedCard"
import { MarketCardSkeletonList } from "@/components/MarketCardSkeleton"
import { Search, Filter, TrendingUp, Loader2, RefreshCw } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useMemo, useCallback } from "react"
import { sortByActivity } from "@/lib/market-utils"
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll"
import { usePullToRefresh } from "@/hooks/usePullToRefresh"

// AC-002: Market type definition
type MarketStatus = 'active' | 'closing_soon' | 'closed' | 'resolved'

interface Market {
  id: string
  title: string
  yesPercent: number
  noPercent: number
  poolTotal: number // USDC
  closesAt: string // ISO timestamp
  category: string
  subcategory: string
  lastBetAt: string // ISO timestamp
  status: MarketStatus
  image?: string // Imagen thumbnail
}

export default function AllMarkets() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  
  // AC-003: Pagination and loading states
  const [displayedCount, setDisplayedCount] = useState(20) // Initial 20 markets
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  
  // Simulate initial loading
  useState(() => {
    setTimeout(() => setIsInitialLoading(false), 500)
  })
  
  // Mock data for all markets with complete information (AC-002)
  const mockMarkets: Market[] = [
    {
      id: "1",
      title: "¿Ganará Real Madrid vs. FC Barcelona?",
      yesPercent: 68,
      noPercent: 32,
      poolTotal: 12500,
      closesAt: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(), // 1.5 horas
      category: "Sports",
      subcategory: "Football",
      lastBetAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'closing_soon',
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: "2",
      title: "¿Man. United ganará contra Liverpool?",
      yesPercent: 72,
      noPercent: 28,
      poolTotal: 10100,
      closesAt: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
      category: "Sports",
      subcategory: "Football",
      lastBetAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'active',
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: "3",
      title: "¿PSG vencerá a Bayern Munich?",
      yesPercent: 65,
      noPercent: 35,
      poolTotal: 11300,
      closesAt: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Sports",
      subcategory: "Football",
      lastBetAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      status: 'active',
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: "4",
      title: "¿Chelsea derrotará a Arsenal?",
      yesPercent: 58,
      noPercent: 42,
      poolTotal: 9800,
      closesAt: new Date(Date.now() + 12 * 60 * 60 * 1000).toISOString(),
      category: "Sports",
      subcategory: "Football",
      lastBetAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: "5",
      title: "¿Juventus ganará vs. AC Milan?",
      yesPercent: 71,
      noPercent: 29,
      poolTotal: 8900,
      closesAt: new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString(),
      category: "Sports",
      subcategory: "Football",
      lastBetAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: "6",
      title: "¿Ganará Biden las elecciones 2024?",
      yesPercent: 62,
      noPercent: 38,
      poolTotal: 18500,
      closesAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Politics",
      subcategory: "Elections",
      lastBetAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      status: 'active',
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: "7",
      title: "¿S&P 500 alcanzará 6000 este año?",
      yesPercent: 67,
      noPercent: 33,
      poolTotal: 22400,
      closesAt: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Economy",
      subcategory: "Stocks",
      lastBetAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      status: 'active',
      image: "/placeholder.svg?height=100&width=100"
    },
    {
      id: "8",
      title: "¿Se lanzará GPT-5 en 2024?",
      yesPercent: 76,
      noPercent: 24,
      poolTotal: 20300,
      closesAt: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(),
      category: "Technology",
      subcategory: "AI",
      lastBetAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      status: 'active',
      image: "/placeholder.svg?height=100&width=100"
    },
  ]

  // AC-001: Sort markets by activity
  const sortedMarkets = useMemo(() => {
    return sortByActivity(mockMarkets)
  }, [])
  
  // AC-003: Paginated markets display
  const displayedMarkets = useMemo(() => {
    return sortedMarkets.slice(0, displayedCount)
  }, [sortedMarkets, displayedCount])
  
  const hasMore = displayedCount < sortedMarkets.length

  // Filter markets based on search (use displayedMarkets for pagination)
  const filteredMarkets = useMemo(() => {
    const marketsToFilter = searchQuery ? sortedMarkets : displayedMarkets
    
    if (!searchQuery) return marketsToFilter
    
    const query = searchQuery.toLowerCase()
    return marketsToFilter.filter(market => 
      market.title.toLowerCase().includes(query) ||
      market.category.toLowerCase().includes(query) ||
      market.subcategory.toLowerCase().includes(query)
    )
  }, [displayedMarkets, sortedMarkets, searchQuery])
  
  // AC-003: Load more handler
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore) return
    
    setIsLoadingMore(true)
    
    // Simulate API call delay
    setTimeout(() => {
      setDisplayedCount(prev => Math.min(prev + 20, sortedMarkets.length))
      setIsLoadingMore(false)
    }, 800)
  }, [isLoadingMore, hasMore, sortedMarkets.length])
  
  // AC-003: Infinite scroll hook
  const { loadMoreRef } = useInfiniteScroll({
    onLoadMore: handleLoadMore,
    hasMore: hasMore && !searchQuery, // Disable infinite scroll when searching
    isLoading: isLoadingMore,
    threshold: 300
  })
  
  // AC-004: Pull-to-refresh handler
  const handleRefresh = useCallback(async () => {
    console.log('🔄 Refreshing markets...')
    
    // Simulate API refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset to initial state
    setDisplayedCount(20)
    setSearchQuery("")
    
    console.log('✅ Markets refreshed!')
  }, [])
  
  // AC-004: Pull-to-refresh hook
  const { pullDistance, isRefreshing } = usePullToRefresh({
    onRefresh: handleRefresh,
    threshold: 80,
    resistance: 2.5
  })

  return (
    <MobileLayout title="All Markets" activeTab="markets">
      {/* AC-004: Pull-to-refresh indicator */}
      {(pullDistance > 0 || isRefreshing) && (
        <div 
          className="fixed top-16 left-0 right-0 flex justify-center z-50 transition-all duration-200"
          style={{ 
            transform: `translateY(${Math.min(pullDistance, 80)}px)`,
            opacity: Math.min(pullDistance / 80, 1)
          }}
        >
          <div className="bg-gray-800 px-4 py-2 rounded-full shadow-lg border border-gray-700 flex items-center gap-2">
            <RefreshCw 
              className={`w-4 h-4 text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`}
              style={{ 
                transform: `rotate(${pullDistance * 3}deg)` 
              }}
            />
            <span className="text-sm text-white font-medium">
              {isRefreshing ? 'Refreshing...' : pullDistance >= 80 ? 'Release to refresh' : 'Pull to refresh'}
            </span>
          </div>
        </div>
      )}
      
      {/* Search and Filter Section */}
      <section className="mb-6">
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search markets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
          </div>
          <button className="touch-target bg-gray-800 border border-gray-700 rounded-lg px-4 flex items-center justify-center hover:bg-gray-700 transition-colors">
            <Filter className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </section>

      {/* All Markets List - AC-002: Market cards with key information */}
      <section className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Active Markets
          </h3>
          <span className="text-sm text-gray-400">
            {searchQuery ? filteredMarkets.length : displayedCount} 
            {!searchQuery && sortedMarkets.length > displayedCount && ` of ${sortedMarkets.length}`}
          </span>
        </div>
        
        {/* AC-003: Initial Loading State */}
        {isInitialLoading ? (
          <MarketCardSkeletonList count={6} />
        ) : (
          <>
        <div className="space-y-3">
              {filteredMarkets.map((market) => (
                <MarketFeedCard
                  key={market.id}
                  id={market.id}
                  title={market.title}
                  yesPercent={market.yesPercent}
                  noPercent={market.noPercent}
                  poolTotal={market.poolTotal}
                  closesAt={market.closesAt}
                  category={market.category}
                  status={market.status}
                  image={market.image}
                  onClick={() => router.push(`/market/${market.id}`)}
                />
              ))}
                  </div>
            
            {/* AC-003: Loading more indicator */}
            {isLoadingMore && (
              <div className="mt-4">
                <MarketCardSkeletonList count={3} />
                </div>
            )}
            
            {/* AC-003: Infinite scroll trigger */}
            {hasMore && !searchQuery && !isLoadingMore && (
              <div ref={loadMoreRef} className="h-20 flex items-center justify-center mt-4">
                <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
              </div>
            )}
            
            {/* End of list indicator */}
            {!hasMore && !searchQuery && filteredMarkets.length > 0 && (
              <div className="text-center py-6 text-gray-400 text-sm">
                No more markets to load
                </div>
            )}
            
            {/* Empty state */}
            {filteredMarkets.length === 0 && !isInitialLoading && (
              <div className="text-center py-12">
                <p className="text-gray-400 mb-4">No markets found</p>
                {searchQuery && (
                <button 
                    onClick={() => setSearchQuery("")}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                >
                    Clear search
                </button>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {/* Categories - Keep as reference */}
      <section className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-3">Categories</h3>
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => setSearchQuery("Sports")}
            className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors"
          >
            <div className="text-white font-medium mb-1">⚽ Sports</div>
            <div className="text-sm text-gray-400">
              {sortedMarkets.filter(m => m.category === "Sports").length} markets
            </div>
          </button>
          <button 
            onClick={() => setSearchQuery("Politics")}
            className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors"
          >
            <div className="text-white font-medium mb-1">🏛️ Politics</div>
            <div className="text-sm text-gray-400">
              {sortedMarkets.filter(m => m.category === "Politics").length} markets
            </div>
          </button>
          <button 
            onClick={() => setSearchQuery("Economy")}
            className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors"
          >
            <div className="text-white font-medium mb-1">💰 Economy</div>
            <div className="text-sm text-gray-400">
              {sortedMarkets.filter(m => m.category === "Economy").length} markets
            </div>
          </button>
          <button 
            onClick={() => setSearchQuery("Technology")}
            className="touch-target bg-gray-800 border border-gray-700 rounded-lg p-4 text-left hover:bg-gray-700 transition-colors"
          >
            <div className="text-white font-medium mb-1">💻 Technology</div>
            <div className="text-sm text-gray-400">
              {sortedMarkets.filter(m => m.category === "Technology").length} markets
            </div>
          </button>
        </div>
      </section>
    </MobileLayout>
  )
}
