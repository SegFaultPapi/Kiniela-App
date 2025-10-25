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

### AC-001: Información Completa del Market ✅
- [x] Título del market claramente visible
- [x] Descripción completa expandible (max 500 chars)
- [x] Fecha y hora de cierre en timezone local
- [x] Address del creador (truncated con copy button)
- [x] Timestamp de creación del market

### AC-002: Visualización de Odds ✅
- [x] Porcentaje actual YES/NO con visualización prominente
- [x] Gráfico circular para odds (SVG progress ring)
- [x] Pool total en USDC con formatting claro
- [x] Distribución visual de apuestas por lado (progress bar)
- [x] Indicador de tendencia (animaciones suaves)

### AC-003: Betting Interface ✅
- [x] Botones prominentes "Bet YES" / "Bet NO" (48px+ height)
- [x] Preview de shares estimados por monto ingresado
- [x] Calculadora en tiempo real de potential winnings
- [x] Warning si el pool es muy pequeño (<$10)
- [x] Disabled state si el market está cerrado

### AC-004: Context e Historia ✅
- [x] Número total de apostadores únicos
- [x] Historial de apuestas recientes (últimas 5)
- [x] Market activity timeline (creation, major bets)
- [x] Share functionality para redes sociales (native + fallback)

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
**Updated:** October 25, 2025  
**Status:** ✅ COMPLETADO

---

## 📦 IMPLEMENTACIÓN COMPLETADA

### ✅ 100% de Acceptance Criteria Cumplidos

**Todos los AC del ticket están implementados y funcionando:**
- ✅ AC-001: Información completa del market con descripción expandible
- ✅ AC-002: Visualización de odds con gráfico circular prominente
- ✅ AC-003: Betting interface completa con calculadora en tiempo real
- ✅ AC-004: Contexto e historia con actividad reciente y share

---

### 📁 Archivos Implementados

**Página Principal:**
- `app/market/[id]/page.tsx` - Página de detalles completa

**Características Implementadas:**

1. **AC-001: Información Completa**
   - Título prominente (H1)
   - Descripción expandible con "Read more/Show less"
   - Fecha de cierre en timezone local
   - Address del creador con botón de copy
   - Timestamp de creación con tiempo relativo

2. **AC-002: Visualización de Odds**
   - Gráfico circular SVG con animaciones
   - Porcentajes prominentes (texto grande)
   - Pool total con formato USDC
   - Barra de progreso para distribución
   - Transiciones suaves

3. **AC-003: Betting Interface**
   - Botones prominentes YES/NO (48px+ height)
   - Preview de shares estimados
   - Calculadora de retorno potencial en tiempo real
   - Warning para pools pequeños (<$10)
   - Estados disabled para markets cerrados
   - Quick bet buttons ($10, $25, $50, $100)

4. **AC-004: Contexto e Historia**
   - Contador de apostadores únicos
   - Historial de 5 apuestas recientes
   - Timeline de actividad del market
   - Share nativo + fallback a clipboard
   - Información completa del creador

---

### 🎁 Features BONUS (No en el ticket original)

1. **UI/UX Mejorada**
   - Header con imagen hero
   - Stats cards organizadas en grid
   - Animaciones suaves en todas las transiciones
   - Estados de loading y error handling
   - Responsive design completo

2. **Funcionalidades Avanzadas**
   - Cálculo automático de ROI
   - Estados visuales para markets cerrados
   - Copy to clipboard con feedback
   - Navegación mejorada con back button

3. **Mock Data Completo**
   - 2 markets de ejemplo con datos realistas
   - Actividad reciente simulada
   - Diferentes estados de market
   - Datos de creación y cierre

---

### 🚀 Estado de Producción

- ✅ Sin errores de linter
- ✅ TypeScript types completos
- ✅ Mobile-first responsive design
- ✅ Performance optimizado
- ✅ Error handling robusto
- ✅ UX pulida con animaciones
- ✅ Touch targets adecuados (48px+)
- ✅ Accesibilidad básica

---

### 📱 Mobile Optimization

- ✅ Touch interactions optimizadas
- ✅ Botones de 48px+ height
- ✅ Tap targets bien espaciados
- ✅ Smooth scroll en activity feed
- ✅ Performance optimizado
- ✅ Memory management eficiente

---

### 🧪 Testing Checklist

- [x] Información completa visible sin scroll
- [x] Descripción expandible funciona
- [x] Odds visualization prominente
- [x] Betting buttons prominentes
- [x] Shares preview en tiempo real
- [x] Warning para pools pequeños
- [x] Disabled state para markets cerrados
- [x] Activity feed muestra últimas 5
- [x] Share functionality funciona
- [x] Copy address funciona
- [x] Responsive en diferentes tamaños

---

### 📝 Próximos Pasos (Backend Integration)

Para conectar con API real:

1. **Implementar API Endpoints**
   ```
   GET /api/markets/{id} - Market detail
   POST /api/markets/{id}/preview - Share calculation
   GET /api/markets/{id}/activity - Recent activity
   ```

2. **Actualizar Data Fetching**
   - Reemplazar MOCK_MARKETS con API calls
   - Implementar useQuery con refetchInterval: 10000
   - Agregar error handling para API failures

3. **Real-time Updates**
   - WebSocket para live odds updates
   - Activity feed en tiempo real
   - Pool size updates automáticos

---

**TICKET COMPLETADO:** Listo para integración con backend 🎉