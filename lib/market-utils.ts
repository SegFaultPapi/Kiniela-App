// AC-002: Utility functions for market data formatting

/**
 * Format USDC amount with proper formatting
 * Examples: $1,234.56, $1.2M, $45.3K
 */
export function formatUSDC(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(1)}K`
  }
  return `$${amount.toFixed(2)}`
}

/**
 * Format time remaining in human-readable format
 * Examples: "2h 30m", "5d 2h", "< 1m"
 */
export function formatTimeRemaining(closesAt: string): string {
  const now = new Date().getTime()
  const closes = new Date(closesAt).getTime()
  const diff = closes - now

  if (diff <= 0) {
    return 'Closed'
  }

  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) {
    return '< 1m'
  }

  if (minutes < 60) {
    return `${minutes}m`
  }

  if (hours < 24) {
    const remainingMinutes = minutes % 60
    if (remainingMinutes === 0) {
      return `${hours}h`
    }
    return `${hours}h ${remainingMinutes}m`
  }

  const remainingHours = hours % 24
  if (remainingHours === 0) {
    return `${days}d`
  }
  return `${days}d ${remainingHours}h`
}

/**
 * Check if market is closing soon (< 2 hours)
 */
export function isClosingSoon(closesAt: string): boolean {
  const now = new Date().getTime()
  const closes = new Date(closesAt).getTime()
  const diff = closes - now
  const twoHours = 2 * 60 * 60 * 1000
  
  return diff > 0 && diff < twoHours
}

/**
 * Get activity score based on recent bets and pool size
 * Higher score = more active
 */
export function calculateActivityScore(
  lastBetAt: string,
  poolTotal: number
): number {
  const now = new Date().getTime()
  const lastBet = new Date(lastBetAt).getTime()
  const hoursSinceLastBet = (now - lastBet) / (1000 * 60 * 60)

  // Base score from pool size (normalized to 0-50)
  const poolScore = Math.min(poolTotal / 1000, 50)

  // Recency score (0-50), decreases with time
  let recencyScore = 0
  if (hoursSinceLastBet < 1) {
    recencyScore = 50
  } else if (hoursSinceLastBet < 6) {
    recencyScore = 40
  } else if (hoursSinceLastBet < 24) {
    recencyScore = 30
  } else if (hoursSinceLastBet < 48) {
    recencyScore = 15
  } else {
    recencyScore = 5
  }

  return poolScore + recencyScore
}

/**
 * Sort markets by activity score
 */
export function sortByActivity<T extends { lastBetAt: string; poolTotal: number }>(
  markets: T[]
): T[] {
  return [...markets].sort((a, b) => {
    const scoreA = calculateActivityScore(a.lastBetAt, a.poolTotal)
    const scoreB = calculateActivityScore(b.lastBetAt, b.poolTotal)
    return scoreB - scoreA // Descending order
  })
}

/**
 * Format percentage for display
 */
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`
}

