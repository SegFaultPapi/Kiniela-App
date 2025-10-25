// KIN-002: Simulated real-time market updates
// En producción, esto usaría WebSocket real
'use client'

import { useEffect } from 'react'
import type { Market } from './useMarketFeed'

interface MarketUpdate {
  id: string
  yesPercent?: number
  noPercent?: number
  poolTotal?: number
  totalBets?: number
  lastBetAt?: string
}

/**
 * Hook para simular real-time updates de markets
 * En producción, esto se conectaría a WebSocket
 */
export function useMarketRealtimeUpdates(
  markets: Market[],
  onUpdate: (updates: MarketUpdate[]) => void,
  enabled: boolean = true
) {
  useEffect(() => {
    if (!enabled || markets.length === 0) return

    console.log('🔴 Real-time updates: CONNECTED (simulated)')

    // Simular updates cada 5-10 segundos
    const intervalId = setInterval(() => {
      // Seleccionar 1-3 markets aleatorios para actualizar
      const numUpdates = Math.floor(Math.random() * 3) + 1
      const updates: MarketUpdate[] = []

      for (let i = 0; i < numUpdates && i < markets.length; i++) {
        const randomMarket = markets[Math.floor(Math.random() * markets.length)]
        
        // Simular cambio pequeño en odds (±1-3%)
        const yesChange = (Math.random() - 0.5) * 6 // -3% to +3%
        const newYesPercent = Math.max(5, Math.min(95, randomMarket.yesPercent + yesChange))
        const newNoPercent = 100 - newYesPercent

        // Simular nuevo bet (pool aumenta)
        const betAmount = Math.random() * 500 + 50 // $50-$550
        const newPoolTotal = randomMarket.poolTotal + betAmount

        updates.push({
          id: randomMarket.id,
          yesPercent: Math.round(newYesPercent),
          noPercent: Math.round(newNoPercent),
          poolTotal: Math.round(newPoolTotal),
          totalBets: (randomMarket.totalBets || 0) + 1,
          lastBetAt: new Date().toISOString()
        })
      }

      if (updates.length > 0) {
        console.log('📊 Real-time update received:', updates)
        onUpdate(updates)
      }
    }, Math.random() * 5000 + 5000) // Every 5-10 seconds

    return () => {
      console.log('🔴 Real-time updates: DISCONNECTED')
      clearInterval(intervalId)
    }
  }, [markets, onUpdate, enabled])
}

/**
 * Aplicar updates a la lista de markets
 */
export function applyMarketUpdates(
  markets: Market[],
  updates: MarketUpdate[]
): Market[] {
  return markets.map(market => {
    const update = updates.find(u => u.id === market.id)
    if (!update) return market

    return {
      ...market,
      ...update
    }
  })
}

