// KIN-002 AC-003: Skeleton loader for market cards

export function MarketCardSkeleton() {
  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 animate-pulse">
      <div className="flex gap-3">
        {/* Image skeleton */}
        <div className="flex-shrink-0 w-16 h-16 bg-gray-700 rounded-lg"></div>
        
        {/* Content skeleton */}
        <div className="flex-1 space-y-3">
          {/* Title skeleton */}
          <div className="space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
          
          {/* Progress bar skeleton */}
          <div className="space-y-1">
            <div className="flex justify-between">
              <div className="h-3 bg-gray-700 rounded w-16"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-2 bg-gray-700 rounded"></div>
          </div>
          
          {/* Metadata skeleton */}
          <div className="flex justify-between items-center">
            <div className="flex gap-3">
              <div className="h-3 bg-gray-700 rounded w-20"></div>
              <div className="h-3 bg-gray-700 rounded w-16"></div>
            </div>
            <div className="h-5 bg-gray-700 rounded w-16"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Multiple skeleton cards
export function MarketCardSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <MarketCardSkeleton key={i} />
      ))}
    </div>
  )
}

