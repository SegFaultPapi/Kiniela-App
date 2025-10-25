# Guía de Integración de API para KIN-002

## 📋 Overview

Este documento explica cómo conectar el Market Feed con la API real de Kiniela cuando esté disponible.

---

## 🏗️ Estructura Actual

### Mock Data (Actual)
- **Hook:** `hooks/useMarketFeed.ts` - Simula llamadas a API con mock data
- **Página:** `app/all-markets/page.tsx` - Usa mock data directamente
- **Ejemplo API-ready:** `app/all-markets/page-with-api.tsx.example` - Muestra cómo usar el hook

### Características Implementadas
- ✅ Auto-refresh cada 30s
- ✅ Error states con retry
- ✅ Infinite scroll
- ✅ Pull-to-refresh
- ✅ Loading states
- ✅ Estructura lista para API real

---

## 🔌 Paso a Paso: Integración API Real

### 1. Crear API Endpoints

Implementar en tu backend los siguientes endpoints:

```typescript
// GET /api/markets
interface MarketsRequest {
  page?: number           // Default: 0
  limit?: number          // Default: 20
  status?: 'active' | 'closing_soon' | 'closed' | 'resolved' | 'all'
  sortBy?: 'activity' | 'pool' | 'recent'
  category?: string
}

interface MarketsResponse {
  markets: Market[]
  nextCursor?: string     // Cursor for next page
  hasMore: boolean
  totalCount: number
}

interface Market {
  id: string
  title: string
  description?: string
  yesPercent: number      // 0-100
  noPercent: number       // 0-100
  poolTotal: number       // USDC amount
  closesAt: string        // ISO timestamp
  category: string
  subcategory?: string
  status: 'active' | 'closing_soon' | 'closed' | 'resolved'
  createdBy?: string      // wallet address
  totalBets?: number
  lastBetAt: string       // ISO timestamp
  image?: string          // thumbnail URL
}
```

### 2. Actualizar useMarketFeed Hook

Reemplazar la función `fetchMarketsAPI` en `hooks/useMarketFeed.ts`:

```typescript
// ANTES (Mock):
const fetchMarketsAPI = async (
  page: number,
  limit: number,
  options: UseMarketFeedOptions
): Promise<FeedResponse> => {
  await new Promise(resolve => setTimeout(resolve, 500))
  return generateMockMarkets(page, limit)
}

// DESPUÉS (API Real):
const fetchMarketsAPI = async (
  page: number,
  limit: number,
  options: UseMarketFeedOptions
): Promise<FeedResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy: options.sortBy || 'activity',
    status: options.status || 'active'
  })

  const response = await fetch(`/api/markets?${params}`, {
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}
```

### 3. Usar el Hook en la Página

Opción A - **Reemplazar página actual:**
```bash
mv app/all-markets/page.tsx app/all-markets/page-old.tsx
mv app/all-markets/page-with-api.tsx.example app/all-markets/page.tsx
```

Opción B - **Actualizar página actual:**
Reemplazar el mock data con el hook `useMarketFeed`:

```typescript
// ANTES:
const [mockMarkets, setMockMarkets] = useState<Market[]>([...])

// DESPUÉS:
const {
  markets,
  isLoading,
  error,
  fetchMore,
  refresh
} = useMarketFeed({
  limit: 20,
  sortBy: 'activity',
  refetchInterval: 30000
})
```

### 4. Agregar Autenticación (Opcional)

Si tu API requiere autenticación:

```typescript
const fetchMarketsAPI = async (...) => {
  const token = localStorage.getItem('authToken')
  
  const response = await fetch(`/api/markets?${params}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  })
  
  // ...
}
```

---

## 🔄 Real-time Updates con WebSocket

### Implementación Opcional

Para updates en tiempo real de odds y pools:

```typescript
// hooks/useMarketWebSocket.ts
export function useMarketWebSocket(marketIds: string[]) {
  useEffect(() => {
    const ws = new WebSocket(process.env.NEXT_PUBLIC_WS_URL!)
    
    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: 'subscribe',
        marketIds
      }))
    }
    
    ws.onmessage = (event) => {
      const update = JSON.parse(event.data)
      // Update market data in state
      handleMarketUpdate(update)
    }
    
    return () => ws.close()
  }, [marketIds])
}
```

Uso en el componente:

```typescript
const { markets } = useMarketFeed()
const marketIds = markets.map(m => m.id)

useMarketWebSocket(marketIds) // Auto-updates markets
```

---

## 📊 Activity Score Algorithm

El algoritmo de ranking considera:

```typescript
function calculateActivityScore(market: Market): number {
  const now = Date.now()
  const lastBetTime = new Date(market.lastBetAt).getTime()
  const hourssSinceLastBet = (now - lastBetTime) / (1000 * 60 * 60)
  
  // Pool score (0-50 points)
  const poolScore = Math.min(market.poolTotal / 1000, 50)
  
  // Recency score (0-50 points)
  let recencyScore = 50
  if (hourssSinceLastBet > 48) {
    recencyScore = 0 // Inactive markets
  } else if (hourssSinceLastBet > 24) {
    recencyScore = 25
  } else if (hourssSinceLastBet < 1) {
    recencyScore = 50 // Very active
  }
  
  return poolScore + recencyScore // 0-100
}
```

---

## 🧪 Testing

### Test Mock API Locally

1. Crear un mock API endpoint:

```typescript
// app/api/markets/route.ts
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '0')
  const limit = parseInt(searchParams.get('limit') || '20')
  
  // Return mock data
  return NextResponse.json({
    markets: [...], // Your mock markets
    hasMore: true,
    nextCursor: `page_${page + 1}`,
    totalCount: 100
  })
}
```

2. Actualizar `fetchMarketsAPI` para usar `/api/markets`

3. Probar en desarrollo:
```bash
npm run dev
```

---

## 🚨 Error Handling

El hook ya maneja errores automáticamente:

```typescript
try {
  const response = await fetchMarketsAPI(...)
  // Success
} catch (err) {
  // Error state se muestra automáticamente
  // Usuario puede hacer retry
}
```

Errores que se manejan:
- ✅ Network errors
- ✅ HTTP errors (4xx, 5xx)
- ✅ Timeout errors
- ✅ Parse errors

---

## 📈 Performance Optimization

### Recomendaciones:

1. **Caching:**
```typescript
// Usar React Query o SWR para mejor caching
import { useInfiniteQuery } from '@tanstack/react-query'

export function useMarketFeed() {
  return useInfiniteQuery({
    queryKey: ['markets', 'active'],
    queryFn: ({ pageParam = 0 }) => fetchMarketsAPI(pageParam),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 30000,
    staleTime: 10000, // 10s cache
  })
}
```

2. **Debounce Search:**
```typescript
const debouncedSearch = useMemo(
  () => debounce((query) => fetchSearch(query), 300),
  []
)
```

3. **Virtual Scrolling** (si >1000 markets):
```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
```

---

## ✅ Checklist de Integración

- [ ] Backend API endpoints implementados
- [ ] `fetchMarketsAPI` actualizado con URL real
- [ ] Autenticación agregada (si necesaria)
- [ ] Error handling probado
- [ ] Loading states verificados
- [ ] Infinite scroll funcionando
- [ ] Auto-refresh probado
- [ ] WebSocket implementado (opcional)
- [ ] Performance optimizada
- [ ] Logs de debug removidos

---

## 📞 Contacto

Si tienes dudas sobre la integración, consulta:
- Documentación del ticket: `documents/tickets/KIN-2/KIN-002-market-feed.md`
- Hook implementation: `hooks/useMarketFeed.ts`
- Example page: `app/all-markets/page-with-api.tsx.example`

---

**Última actualización:** Octubre 25, 2025

