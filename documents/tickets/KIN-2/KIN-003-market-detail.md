# KIN-003: Ver Detalle de Market

**Epic:** Usuario Consumidor  
**Priority:** P0 (Critical)  
**Estimate:** 2 days  
**Phase:** 2 - Core User Experience

---

## 📋 User Story

**Como** usuario consumidor  
**Quiero** ver todos los detalles de un market antes de apostar  
**Para** tomar una decisión informada

---

## ✅ Acceptance Criteria

### AC-001: Información Completa del Market
- [ ] Título del market claramente visible
- [ ] Descripción completa expandible (max 500 chars)
- [ ] Fecha y hora de cierre en timezone local
- [ ] Address del creador (truncated con copy button)
- [ ] Timestamp de creación del market

### AC-002: Visualización de Odds
- [ ] Porcentaje actual SÍ/NO con visualización prominente
- [ ] Gráfico circular o de barras para odds
- [ ] Pool total en USDC con formatting claro
- [ ] Distribución visual de apuestas por lado
- [ ] Indicador de tendencia (si odds cambiaron recientemente)

### AC-003: Betting Interface
- [ ] Botones prominentes "Apostar SÍ" / "Apostar NO"
- [ ] Preview de shares estimados por monto ingresado
- [ ] Calculadora en tiempo real de potential winnings
- [ ] Warning si el pool es muy pequeño (<$10)
- [ ] Disabled state si el market está cerrado

### AC-004: Context e Historia
- [ ] Número total de apostadores únicos
- [ ] Historial de apuestas recientes (últimas 5)
- [ ] Market activity timeline (creation, major bets)
- [ ] Share functionality para redes sociales

---

## 🎨 Design Requirements

### Detail Page Layout
```
[< Volver] [Share]

¿Ganará América la Liga MX?

[Expandable description...]

┌─────────────────────────────┐
│     67%        33%         │
│    ████████░░░              │
│     SÍ         NO           │
└─────────────────────────────┘

Pool total: $2,340 USDC
Cierra: 15 Oct, 8:00 PM
Apostadores: 23 únicos

Tu apuesta: [Input] USDC
Recibirías: ~45.2 shares SÍ
Ganancia potencial: $67.8 (+45%)

[APOSTAR SÍ - $$$] [APOSTAR NO - $$$]

Creado por: 0x1234...5678 [Copy]
Actividad reciente:
• Juan apostó $25 NO hace 5m
• María apostó $50 SÍ hace 12m
```

### Visual Hierarchy
- **Title:** H1, prominente
- **Odds:** Large visual element, center stage
- **CTA Buttons:** Primary action, contrasting colors
- **Meta info:** Secondary styling
- **Activity:** Tertiary, scrollable if needed

---

## 🔧 Technical Requirements

### Data Fetching
```typescript
const useMarketDetail = (marketId: string) => {
  return useQuery({
    queryKey: ['market', marketId],
    queryFn: () => fetchMarketDetail(marketId),
    refetchInterval: 10000, // 10s updates
    staleTime: 5000,
  });
};

// Share Calculation
const useSharesPreview = (marketId: string, amount: number, side: 'yes' | 'no') => {
  return useQuery({
    queryKey: ['shares-preview', marketId, amount, side],
    queryFn: () => calculateShares({ marketId, amount, side }),
    enabled: amount > 0,
    keepPreviousData: true,
  });
};
```

### API Endpoints
- `GET /api/markets/{id}` - Market detail
- `POST /api/markets/{id}/preview` - Share calculation
- `GET /api/markets/{id}/activity` - Recent activity

### Real-time Updates
- Live odds updates every 10s
- Activity feed updates on new bets
- Pool size updates in real-time

---

## 🗃️ Data Schema

### Market Detail Object
```typescript
interface MarketDetail {
  id: string;
  title: string;
  description: string;
  yesPercent: number;
  noPercent: number;
  poolTotal: number;
  uniqueBettors: number;
  closesAt: string;
  createdAt: string;
  createdBy: string;
  status: 'active' | 'closing_soon' | 'closed' | 'resolved';
  recentActivity: BetActivity[];
  myPosition?: UserPosition;
}

interface BetActivity {
  user: string; // truncated address
  amount: number;
  side: 'yes' | 'no';
  timestamp: string;
}

interface UserPosition {
  side: 'yes' | 'no';
  shares: number;
  amountInvested: number;
  currentValue: number;
}
```

### Shares Preview
```typescript
interface SharesPreview {
  shares: number;
  cost: number;
  averagePrice: number;
  potentialWinnings: number;
  breakEvenOdds: number;
}
```

---

## 🧪 Test Scenarios

### Happy Path
1. Usuario tap en market card → Navega a detalle
2. Ve información completa y odds actuales
3. Ingresa monto → Ve preview de shares
4. Tap "Apostar SÍ" → Procede a confirmación
5. Back button → Regresa al feed

### Data States
1. **Loading:** Skeleton del layout mientras carga
2. **Error:** Network error → Retry button
3. **Market Closed:** CTA buttons disabled + message
4. **No Activity:** "No recent bets" message
5. **Large Numbers:** Proper formatting (1.2K, 1.2M)

### Interaction Flows
1. **Share Market:** Native share sheet funciona
2. **Copy Creator Address:** Clipboard + toast confirmation  
3. **Amount Input:** Real-time shares calculation
4. **Betting Flow:** Smooth transition a KIN-004
5. **Navigation:** Back preserves feed state

---

## 📱 Mobile Optimization

### Touch Interactions
- Large betting buttons (min 48px height)
- Swipe gestures para navegación (nice-to-have)
- Tap targets bien espaciados
- Smooth scroll en activity feed

### Performance
- Image lazy loading si hay media
- Debounced shares calculation
- Efficient re-renders
- Memory management

### Accessibility
- Semantic HTML structure
- Screen reader labels
- High contrast mode support
- Focus management

---

## 🔗 Dependencies

### Blockers
- [ ] KIN-002 (Market Feed) navigation
- [ ] Smart contract ABIs para shares calculation
- [ ] Market detail API endpoints
- [ ] Activity tracking system

### Integrations
- [ ] KIN-004 (Place Bet) - Smooth handoff
- [ ] Share functionality (native APIs)
- [ ] Analytics tracking
- [ ] Error monitoring

---

## 🎯 User Experience Goals

### Information Architecture
- All relevant info visible without scrolling
- Progressive disclosure para details
- Clear visual hierarchy
- Scannable layout

### Decision Support
- Clear odds visualization
- Risk/reward calculation
- Recent activity context
- Creator reputation (basic)

### Action Clarity
- Obvious next steps
- Clear betting options
- Transparent cost calculation
- Confident interaction feedback

---

## 📊 Success Metrics

### Engagement KPIs
- Time on market detail: >45s average
- Bet conversion rate: >15% of viewers
- Share action usage: >5% of viewers
- Back navigation: <30% immediate bounce

### Technical KPIs
- Page load time: <1s
- Shares calculation: <200ms
- Error rate: <1%
- Mobile performance: >55fps

---

## 🚨 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Slow shares calculation | High | Caching + debouncing |
| Confusing odds display | High | User testing + clear labels |
| Information overload | Medium | Progressive disclosure |
| Poor mobile performance | High | Performance optimization |

---

## 📋 Implementation Plan

### Day 1: Core Detail View
- Basic layout implementation
- Market data fetching
- Odds visualization
- Navigation integration

### Day 2: Interactive Features  
- Shares preview calculation
- Activity feed
- Share functionality
- Mobile optimization
- Error handling

---

**Created:** October 13, 2025  
**Updated:** October 13, 2025  
**Status:** 📋 Ready for Development