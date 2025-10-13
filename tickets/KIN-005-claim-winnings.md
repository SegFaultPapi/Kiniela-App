# KIN-005: Claim Winnings

**Epic:** Usuario Consumidor  
**Priority:** P1 (Important)  
**Estimate:** 2 days  
**Phase:** 2 - Core User Experience

---

## 📋 User Story

**Como** usuario ganador  
**Quiero** reclamar mis ganancias cuando el market se resuelva  
**Para** recibir mis tokens ganados

---

## ✅ Acceptance Criteria

### AC-001: Detección de Markets Ganadores
- [ ] Botón "Claim" visible solo en markets ganadores resueltos
- [ ] Badge/indicator en "Mis Posiciones" para winnings disponibles
- [ ] Push notification cuando market se resuelve a favor (nice-to-have)
- [ ] Auto-refresh para detectar resoluciones recientes
- [ ] No mostrar claim si ya fue ejecutado

### AC-002: Preview de Claim
- [ ] Mostrar cantidad exacta a recibir antes de confirmar
- [ ] Breakdown: shares owned × final price
- [ ] Fees de withdrawal si aplica
- [ ] Net amount después de fees
- [ ] Estimated gas cost para la transacción

### AC-003: Ejecución de Claim
- [ ] Transacción automática via smart contract
- [ ] Loading state durante claim process
- [ ] Transaction hash visible post-submission
- [ ] Success confirmation con amount recibido
- [ ] Error handling robusto con retry options

### AC-004: Balance Update
- [ ] Actualización automática de balance USDC
- [ ] Update de "Mis Posiciones" (remove claimed)
- [ ] Historical record del claim en activity
- [ ] Real-time balance reflection
- [ ] Cache invalidation apropiada

### AC-005: Histórico de Claims
- [ ] Lista de todos los claims realizados
- [ ] Timestamp, market name, amount por cada claim
- [ ] Filter por fecha/monto
- [ ] Export functionality (CSV, nice-to-have)
- [ ] Link back a market original

---

## 🎨 Design Requirements

### Claim Button States
```
Market: ¿Ganará América la Liga MX? ✅ RESUELTO (SÍ)

Tu posición: 45.2 shares SÍ
Estado: 🏆 GANASTE!

Claim disponible: $67.80 USDC
- Shares: 45.2 × $1.50 = $67.80
- Fees: $0.00
- Gas estimado: ~$0.02

[CLAIM WINNINGS - $67.80] 🎉
```

### My Positions - Winner View
```
📈 Mis Posiciones

┌─────────────────────────────────┐
│ ⚽ América vs Cruz Azul? ✅      │
│ Ganaste: $67.80 disponible     │
│ [CLAIM NOW] 🎉                  │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│ 🌧️ ¿Llueve mañana? ❌           │
│ Perdiste: $30.00                │
│ (Resuelto: NO)                  │
└─────────────────────────────────┘
```

### Claim History
```
💰 Historial de Claims

• $67.80 - América Liga MX (Oct 15)
• $23.45 - Bitcoin $100K (Oct 10)  
• $156.20 - Elecciones CDMX (Oct 5)

Total reclamado: $247.45
```

---

## 🔧 Technical Requirements

### Smart Contract Integration
```typescript
const useClaimWinnings = () => {
  return useMutation({
    mutationFn: async ({ marketId, positionId }) => {
      const contract = getMarketContract(marketId);
      return contract.claimWinnings(positionId);
    },
    onSuccess: (txHash, { amount }) => {
      queryClient.invalidateQueries(['positions']);
      queryClient.invalidateQueries(['balance']);
      toast.success(`Claimed $${amount} USDC!`);
      trackEvent('claim_winnings', { amount, marketId });
    },
  });
};

// Claimable Detection
const useClaimablePositions = () => {
  return useQuery({
    queryKey: ['positions', 'claimable'],
    queryFn: fetchClaimablePositions,
    refetchInterval: 30000, // Check every 30s
  });
};
```

### Claim Calculation
```typescript
interface ClaimablePosition {
  marketId: string;
  positionId: string;
  marketTitle: string;
  shares: number;
  finalPrice: number; // 1.0 for winner, 0.0 for loser
  claimableAmount: number;
  gasFee: number;
  alreadyClaimed: boolean;
  resolution: 'yes' | 'no';
  userSide: 'yes' | 'no';
}

const calculateClaim = (shares: number, finalPrice: number) => {
  return shares * finalPrice; // Simple for binary markets
};
```

### Error Scenarios
- Contract revert → Retry with higher gas
- Network timeout → Queue for retry
- Already claimed → Remove from claimable list
- Invalid position → Hide claim button

---

## 🗃️ Data Flow

### Claim Process
1. **Detection:** Market resolves → Query claimable positions
2. **Display:** Show claim button with amount preview  
3. **Initiate:** User clicks claim → Get gas estimate
4. **Execute:** Submit transaction → Show loading
5. **Confirm:** Transaction success → Update UI
6. **Refresh:** Invalidate caches → New state

### State Management
```typescript
type ClaimState = 
  | 'available'    // Ready to claim
  | 'estimating'   // Getting gas estimate  
  | 'confirming'   // User confirming
  | 'pending'      // Transaction submitted
  | 'success'      // Claim successful
  | 'error';       // Something failed
```

---

## 🧪 Test Scenarios

### Happy Path
1. Market se resuelve a favor del usuario
2. Claim button aparece en "Mis Posiciones"
3. User ve preview de amount a recibir
4. Confirma claim → Transaction submitted
5. Success message + balance updated
6. Position removed de active, added a history

### Edge Cases
1. **Multiple Claimable:** Batch claim option
2. **Very Small Amount:** Gas warning if claim < gas cost
3. **Market Resolution Changed:** Re-check claimable status
4. **Network Congestion:** High gas fee warning
5. **Contract Upgrade:** Backward compatibility

### Error Scenarios
1. **Already Claimed:** Graceful handling + UI update
2. **Transaction Failed:** Clear retry mechanism
3. **Insufficient Gas:** Auto-retry with higher gas
4. **Contract Error:** Human-readable error message

---

## 📱 Mobile Experience

### Notifications
- Push notification cuando market se resuelve
- Badge count en "Mis Posiciones" tab
- Clear CTAs para claim process

### UX Optimization
- One-tap claim process
- Clear success animations
- Immediate balance reflection
- Intuitive error recovery

---

## 🔗 Dependencies

### Blockers
- [ ] Market resolution mechanism working
- [ ] KIN-006 (My Positions) para display
- [ ] Smart contract claim function
- [ ] Balance update system

### Nice-to-Have
- [ ] Push notifications
- [ ] Batch claim functionality
- [ ] Export historical data
- [ ] Social sharing para wins

---

## 💰 Economic Considerations

### Gas Optimization
- Batch multiple claims si es posible
- Gas estimation pre-transaction
- Warning si claim amount < gas cost
- Consider gas subsidization

### Fee Structure
- Transparent fee breakdown
- No hidden withdrawal fees (MVP)
- Clear cost/benefit calculation
- User education sobre gas costs

---

## 📊 Success Metrics

### Claim KPIs
- Claim completion rate: >90% of winners
- Average time to claim: <24h post-resolution
- Failed claim rate: <5%
- Gas optimization: <$0.10 average cost

### User Satisfaction
- Winners actually receive funds
- Fast claim process (<30s)
- Clear communication
- No lost funds/stuck claims

---

## 🚨 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| Smart contract bug | Critical | Extensive testing + audit |
| High gas costs | Medium | Gas subsidization + warnings |
| User confusion | Medium | Clear UI + help docs |
| Failed transactions | Medium | Robust retry mechanism |

---

## 📋 Implementation Plan

### Day 1: Core Claim Logic
- Claimable position detection
- Claim calculation logic
- Basic UI components
- Smart contract integration

### Day 2: UX Polish
- Loading states + animations
- Error handling + retry logic
- Balance update flow
- Historical claims view
- Mobile optimization

---

**Created:** October 13, 2025  
**Updated:** October 13, 2025  
**Status:** 📋 Ready for Development