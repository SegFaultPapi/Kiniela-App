# KIN-006: Ver Mis Posiciones

**Epic:** Usuario Consumidor  
**Priority:** P1 (Important)  
**Estimate:** 2 days  
**Phase:** 2 - Core User Experience

---

## 📋 User Story

**Como** usuario consumidor  
**Quiero** ver todos los markets donde he apostado  
**Para** hacer seguimiento de mis inversiones

---

## ✅ Acceptance Criteria

### AC-001: Tab Dedicado "Mis Posiciones"
- [ ] Tab claramente visible en navigation bar
- [ ] Badge count con number de posiciones activas
- [ ] Icon indication para winnings pendientes
- [ ] Smooth transition desde otros tabs
- [ ] Empty state si no hay posiciones

### AC-002: Lista de Markets con Posiciones
- [ ] Todas las posiciones del usuario (activas + históricas)
- [ ] Ordenadas por relevancia: claimable > active > historical
- [ ] Market title + mi posición (SÍ/NO) claramente visible
- [ ] Monto apostado original mostrado
- [ ] Valor actual de la posición calculado en tiempo real

### AC-003: Status Indicators
- [ ] **Activo:** Market aún no resuelto, posición válida
- [ ] **Pendiente resolución:** Market cerrado, esperando outcome
- [ ] **Ganado:** Market resuelto a mi favor, claim disponible
- [ ] **Perdido:** Market resuelto en contra, pérdida confirmada
- [ ] Color coding + iconography clara para cada estado

### AC-004: Información Detallada
- [ ] Break-even point para cada posición
- [ ] P&L actual (ganancia/pérdida no realizada)
- [ ] Porcentaje de return (+45%, -23%)
- [ ] Tiempo restante para markets activos
- [ ] Quick access a market detail page

### AC-005: Filtros y Organización
- [ ] Filtros: Activos, Ganados, Perdidos, Todos
- [ ] Sort options: Newest, P&L, Amount, Closing soon
- [ ] Search por market title
- [ ] Collapse/expand por status groups
- [ ] Total invested + total winnings summary

---

## 🎨 Design Requirements

### Tab Layout
```
[Header: Kiniela + Balance]
[Tab Bar: Feed | 📈 Mis Posiciones (3) | Crear]

💰 Portfolio Summary:
Invertido: $423.50 | Valor actual: $467.20 (+$43.70, +10.3%)

🎯 Filtros: [Todos] [Activos] [Ganados] [Perdidos]
📊 Sort: [Newest ▼]

🏆 PARA RECLAMAR (1)
┌─────────────────────────────────┐
│ ⚽ América vs Cruz Azul ✅       │
│ Tu apuesta: $30 SÍ → GANASTE    │
│ Claim: $67.80 (+126%) 🎉        │
│ [CLAIM NOW]                     │
└─────────────────────────────────┘

📊 ACTIVOS (2)
┌─────────────────────────────────┐
│ 🌧️ ¿Llueve mañana?              │
│ Tu apuesta: $15 NO               │
│ Valor actual: $18.50 (+23%)     │
│ Cierra en: 18h 23m               │
└─────────────────────────────────┘

📉 PERDIDOS (1)
┌─────────────────────────────────┐
│ 🏈 Chiefs ganan Super Bowl ❌    │
│ Tu apuesta: $50 SÍ → PERDISTE    │
│ (-$50, -100%)                   │
│ (Resuelto: NO)                  │
└─────────────────────────────────┘
```

### Position Card Design
- **Status Badge:** Color-coded en top-right
- **Title:** Truncated pero legible
- **Position Info:** Amount + side (SÍ/NO)
- **P&L:** Prominente, color-coded green/red
- **Action Button:** Context-specific (View, Claim, etc.)

---

## 🔧 Technical Requirements

### Data Fetching
```typescript
const useUserPositions = (filters?: PositionFilters) => {
  return useQuery({
    queryKey: ['positions', userId, filters],
    queryFn: () => fetchUserPositions(userId, filters),
    refetchInterval: 15000, // Update every 15s
    staleTime: 10000,
  });
};

// Real-time P&L Calculation
const usePositionValue = (position: Position) => {
  const { data: market } = useMarket(position.marketId);
  
  return useMemo(() => {
    if (!market) return position.amountInvested;
    
    const currentPrice = position.side === 'yes' 
      ? market.yesPercent / 100 
      : market.noPercent / 100;
      
    return position.shares * currentPrice;
  }, [market, position]);
};
```

### Position States
```typescript
type PositionStatus = 
  | 'active'           // Market open, can still change
  | 'pending'          // Market closed, awaiting resolution  
  | 'won'              // Resolved in favor, claimable
  | 'lost'             // Resolved against, funds lost
  | 'claimed';         // Winnings claimed, archived

interface UserPosition {
  id: string;
  marketId: string;
  marketTitle: string;
  side: 'yes' | 'no';
  shares: number;
  amountInvested: number;
  averagePrice: number;
  currentValue: number;
  pnl: number;
  pnlPercentage: number;
  status: PositionStatus;
  placedAt: string;
  resolvedAt?: string;
  claimableAmount?: number;
}
```

---

## 🗃️ Portfolio Analytics

### Summary Calculations
```typescript
const usePortfolioSummary = (positions: UserPosition[]) => {
  return useMemo(() => {
    const active = positions.filter(p => p.status === 'active');
    const totalInvested = positions.reduce((sum, p) => sum + p.amountInvested, 0);
    const currentValue = active.reduce((sum, p) => sum + p.currentValue, 0);
    const realizedPnL = positions
      .filter(p => ['won', 'lost', 'claimed'].includes(p.status))
      .reduce((sum, p) => sum + p.pnl, 0);
    
    return {
      totalInvested,
      currentValue,
      unrealizedPnL: currentValue - totalInvested,
      realizedPnL,
      totalPnL: realizedPnL + (currentValue - totalInvested),
      winRate: calculateWinRate(positions),
      activePositions: active.length,
      claimableAmount: positions
        .filter(p => p.status === 'won')
        .reduce((sum, p) => sum + p.claimableAmount!, 0)
    };
  }, [positions]);
};
```

---

## 🧪 Test Scenarios

### Data States
1. **Empty State:** No positions → Encouraging message + CTA to explore markets
2. **Loading State:** Skeleton cards mientras carga
3. **Error State:** Network error → Retry button
4. **Mixed Positions:** Active, won, lost positions mezcladas

### User Interactions
1. **Filter Selection:** Smooth filtering sin re-fetch
2. **Sort Changes:** Instant re-ordering
3. **Position Tap:** Navigate to market detail
4. **Claim Button:** Direct to KIN-005 flow
5. **Pull-to-Refresh:** Update all position values

### Real-time Updates
1. **Odds Changes:** P&L updates automatically
2. **Market Resolution:** Status changes from active → won/lost
3. **Claims Executed:** Position moves to claimed
4. **New Positions:** Appear immediately after betting

---

## 📱 Mobile Experience

### Performance
- Virtual scrolling para large position lists
- Efficient P&L calculations
- Minimal re-renders
- Fast filtering/sorting

### UX Design
- Clear visual hierarchy
- Easy-to-scan format
- Thumb-friendly touch targets
- Swipe gestures (nice-to-have)

### Accessibility
- Screen reader labels
- High contrast support
- Focus management
- Status announcements

---

## 🔗 Dependencies

### Critical Dependencies
- [ ] KIN-004 (Place Bet) creates positions
- [ ] KIN-005 (Claim) integrates seamlessly
- [ ] Real-time market data pipeline
- [ ] User authentication/sessions

### Data Requirements
- User position tracking
- Market state synchronization  
- P&L calculation accuracy
- Historical position data

---

## 📊 Success Metrics

### Engagement KPIs
- Time spent on Positions tab: >45s average
- Position check frequency: >3x per day for active users
- Filter/sort usage: >30% of users
- Return rate: >70% check positions next day

### Product KPIs
- Portfolio tracking accuracy: 99%+
- Real-time update lag: <5s
- Claim conversion: >90% of winners
- User retention after first win: >80%

---

## 🎯 UX Considerations

### Information Density
- Show essential info without clutter
- Progressive disclosure para details
- Clear visual hierarchy
- Scannable format

### Emotional Design
- Celebrate wins prominently
- Soften losses with learning context
- Motivate continued engagement
- Build confidence through transparency

### Action Clarity
- Clear next steps para each position
- Prominent CTAs where appropriate
- Easy navigation to related features
- Intuitive status communication

---

## 🚨 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Incorrect P&L calculation | High | Extensive testing + audit |
| Slow performance con muchas posiciones | Medium | Virtual scrolling + pagination |
| Confusing status indicators | Medium | User testing + clear iconography |
| Missing position data | Medium | Robust error handling + refresh |

---

## 📋 Implementation Plan

### Day 1: Core Position Display
- Basic position list UI
- Position data fetching
- Status indicators
- Navigation integration

### Day 2: Advanced Features
- Portfolio summary calculations
- Filtering and sorting
- Real-time P&L updates
- Empty/error states
- Mobile optimization
- KIN-005 integration

---

**Created:** October 13, 2025  
**Updated:** October 13, 2025  
**Status:** 📋 Ready for Development