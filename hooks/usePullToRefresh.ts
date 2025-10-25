// KIN-002 AC-004: Pull-to-refresh hook
'use client'

import { useEffect, useRef, useState } from 'react'

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number // Distance to pull before triggering refresh
  resistance?: number // Pull resistance factor
}

export function usePullToRefresh({
  onRefresh,
  threshold = 80,
  resistance = 2.5
}: UsePullToRefreshOptions) {
  const [pullDistance, setPullDistance] = useState(0)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const startY = useRef(0)
  const isPulling = useRef(false)

  useEffect(() => {
    let touchStartY = 0

    const handleTouchStart = (e: TouchEvent) => {
      // Only start if at top of page
      if (window.scrollY === 0) {
        touchStartY = e.touches[0].clientY
        startY.current = touchStartY
        isPulling.current = true
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (!isPulling.current || isRefreshing) return

      const touchY = e.touches[0].clientY
      const distance = touchY - startY.current

      // Only pull down
      if (distance > 0) {
        // Apply resistance
        const resistedDistance = distance / resistance
        setPullDistance(Math.min(resistedDistance, threshold * 1.5))
        
        // Prevent default scroll when pulling
        if (distance > 10) {
          e.preventDefault()
        }
      }
    }

    const handleTouchEnd = async () => {
      if (!isPulling.current) return

      isPulling.current = false

      if (pullDistance >= threshold) {
        setIsRefreshing(true)
        setPullDistance(threshold)
        
        try {
          await onRefresh()
        } finally {
          setIsRefreshing(false)
          setPullDistance(0)
        }
      } else {
        setPullDistance(0)
      }
    }

    document.addEventListener('touchstart', handleTouchStart, { passive: true })
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      document.removeEventListener('touchstart', handleTouchStart)
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
    }
  }, [pullDistance, threshold, resistance, isRefreshing, onRefresh])

  return {
    pullDistance,
    isRefreshing,
    isPulling: isPulling.current
  }
}

