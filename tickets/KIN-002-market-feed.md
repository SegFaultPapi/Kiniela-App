# KIN-002: Ver Feed de Markets Activos

**Epic:** Usuario Consumidor  
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Phase:** 2 - Core User Experience

---

## 📋 User Story

**Como** usuario consumidor  
**Quiero** ver una lista simple de markets activos destacados  
**Para** encontrar rápidamente dónde apostar

---

## ✅ Acceptance Criteria

### AC-001: Lista Ordenada por Actividad
- [ ] Markets ordenados por actividad (más apuestas recientes primero)
- [ ] Algoritmo de ranking considera: recency, pool size, time remaining
- [ ] Markets inactivos (sin apuestas en 24h) van al final
- [ ] Refresh automático cada 30s para mantener orden actualizado

### AC-002: Información Clave Visible
- [ ] Título del market (max 120 chars, truncated con ellipsis)
- [ ] Porcentaje SÍ/NO con visualización clara (pie chart o barras)
- [ ] Pool total en USDC con formatting ($1,234.56)
- [ ] Tiempo restante en formato human-readable (2h 30m, 5d 2h)
- [ ] Visual indicator si el market está próximo a cerrar (<2h)

### AC-003: Paginación y Performance
- [ ] Máximo 20 markets por página inicial
- [ ] Infinite scroll para cargar más markets
- [ ] Loading states mientras carga nueva página
- [ ] Skeleton loaders para mejor UX
- [ ] Error state si falla la carga

### AC-004: Interactividad Mobile-First
- [ ] Pull-to-refresh implementado
- [ ] Swipe gestures para navegación (nice-to-have)
- [ ] Touch target mínimo 44px para cards
- [ ] Tap en card navega a detalle del market
- [ ] Loading feedback inmediato al tap

---

## 🎨 Design Requirements

### Market Card Layout
```
┌─────────────────────────────────┐
│ ¿Ganará América la Liga MX?     │
│ ================================│
│ SÍ 67%  ████████░░ 33% NO       │
│ Pool: $2,340 USDC | 2h restantes │
│                            [>] │
└─────────────────────────────────┘
```

### Feed Layout
```
[Header: Kiniela + Balance USDC]
[Tab Bar: Feed | Mis Markets | Crear]

[Pull to refresh indicator]
[Market Card 1]
[Market Card 2]
[Market Card 3]
...
[Loading more...]
```

### Visual Hierarchy
- **Title:** Large, bold, dark text
- **Odds:** Prominent visual (progress bar or donut chart)
- **Pool/Time:** Secondary info, smaller text
- **Status indicators:** Color-coded (green=active, yellow=closing soon, red=closed)

---

## 🔧 Technical Requirements

### Data Fetching
```typescript
// Market Feed Query
const useMarketFeed = () => {
  return useInfiniteQuery({
    queryKey: ['markets', 'active'],
    queryFn: ({ pageParam = 0 }) => 
      fetchMarkets({ 
        page: pageParam, 
        limit: 20,
        status: 'active',
        sortBy: 'activity'
      }),
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    refetchInterval: 30000, // 30s refresh
  });
};
```

### API Endpoints
- `GET /api/markets?page=0&limit=20&status=active&sort=activity`
- Response: `{ markets: [], nextCursor: string, hasMore: boolean }`

### Real-time Updates
- WebSocket connection para live odds updates
- EventSource para market status changes
- Optimistic updates para smooth UX

---

## 🗃️ Data Schema

### Market Object
```typescript
interface Market {
  id: string;
  title: string;
  description: string;
  yesPercent: number; // 0-100
  noPercent: number;  // 0-100
  poolTotal: number;  // USDC amount
  closesAt: string;   // ISO timestamp
  status: 'active' | 'closing_soon' | 'closed' | 'resolved';
  createdBy: string;  // wallet address
  activityScore: number; // for ranking
  lastBetAt: string;  // ISO timestamp
}
```

### Feed Response
```typescript
interface FeedResponse {
  markets: Market[];
  nextCursor?: string;
  hasMore: boolean;
  totalCount: number;
}
```

---

## 🧪 Test Scenarios

### Happy Path
1. Usuario abre app → Feed carga con markets activos
2. Ve 20 markets ordenados por actividad
3. Scroll down → Carga más markets automáticamente
4. Pull-to-refresh → Feed se actualiza
5. Tap en market → Navega a detalle

### Data States
1. **Empty State:** No markets activos → "No markets available" message + CTA crear
2. **Loading State:** Skeleton cards mientras carga
3. **Error State:** Network error → Retry button + offline message
4. **Refresh State:** Pull-to-refresh indicator + smooth animation

### Edge Cases
1. **Very Long Titles:** Truncation funciona correctamente
2. **High Pool Values:** Number formatting correcto ($1.2M)
3. **Markets Closing:** Time remaining updates en real-time
4. **Network Issues:** Offline state + retry mechanism
5. **Empty Results:** Proper empty state con CTA

---

## 📱 Mobile Optimization

### Performance Requirements
- First contentful paint: <1.5s
- Smooth 60fps scrolling
- Memory efficient (recycle cards)
- Image lazy loading (if any)

### Touch Interactions
- Pull-to-refresh native feel
- Smooth infinite scroll
- Instant tap feedback
- Proper scroll momentum

### Responsive Design
- Works on screens 320px-428px width
- Readable text sizes (16px minimum)
- Adequate spacing between elements
- Thumb-friendly interaction zones

---

## 🔗 Dependencies

### Blockers
- [ ] KIN-001 (Wallet Connection) completado
- [ ] Markets API endpoints implemented
- [ ] Database con sample markets
- [ ] Real-time infrastructure setup

### Nice-to-Have
- [ ] WebSocket para live updates
- [ ] Push notifications para favorite markets
- [ ] Search/filter functionality
- [ ] Market categories

---

## 📊 Success Metrics

### Performance KPIs
- Page load time: <1.5s
- Time to interactive: <2s
- Scroll performance: >55fps average
- Error rate: <2%

### User Engagement
- Markets viewed per session: >3 average
- Click-through rate to detail: >20%
- Time spent on feed: >30s average
- Return rate: >60% daily

---

## 🚨 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slow API responses | High | Caching + skeleton loading |
| Real-time updates lag | Medium | Polling fallback |
| Poor mobile performance | High | Performance testing + optimization |
| Empty states confusing users | Medium | Clear CTAs + onboarding |

---

## 📋 Implementation Plan

### Phase 1: Basic Feed (Day 1)
- Static market cards
- Basic API integration  
- Infinite scroll
- Loading states

### Phase 2: Real-time Updates (Day 2)
- Live odds updates
- Activity-based ranking
- Pull-to-refresh
- Error handling
- Mobile optimization

---

**Created:** October 13, 2025  
**Updated:** October 13, 2025  
**Status:** 📋 Ready for Development