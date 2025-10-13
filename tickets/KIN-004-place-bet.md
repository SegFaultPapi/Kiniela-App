# KIN-004: Realizar Apuesta

**Epic:** Usuario Consumidor  
**Priority:** P0 (Critical Path)  
**Estimate:** 3 days  
**Phase:** 2 - Core User Experience

---

## 📋 User Story

**Como** usuario consumidor  
**Quiero** apostar en un outcome (SÍ/NO) con monto específico  
**Para** participar en el market

---

## ✅ Acceptance Criteria

### AC-001: Selección de Outcome
- [ ] Usuario puede elegir entre "SÍ" o "NO" claramente
- [ ] Visual feedback de selección actual
- [ ] Toggle entre opciones funciona smooth
- [ ] Selection state persiste durante input
- [ ] Clear indication de cual está seleccionado

### AC-002: Input de Monto
- [ ] Input numérico para monto en USDC
- [ ] Validación de monto mínimo ($0.01)
- [ ] Validación contra balance disponible
- [ ] Quick amount buttons ($5, $10, $25, MAX)
- [ ] Format con decimales apropiados
- [ ] Real-time validation feedback

### AC-003: Preview de Transacción
- [ ] Shares que recibirá calculado en tiempo real
- [ ] Precio promedio por share mostrado
- [ ] Potential winnings si gana
- [ ] Fees transparentes (gas + protocol fee)
- [ ] Impact en las odds del market
- [ ] Slippage warning si es significativo

### AC-004: Confirmación y Ejecución
- [ ] Botón de confirmación prominente y claro
- [ ] Loading state durante transacción
- [ ] Transaction hash visible después de submit
- [ ] Success/error feedback apropiado
- [ ] Actualización automática de balance
- [ ] Redirection a market detail con nueva posición

### AC-005: Error Handling
- [ ] Insufficient balance → Clear error message
- [ ] Network errors → Retry mechanism
- [ ] Transaction rejection → Helpful guidance  
- [ ] Slippage exceeded → Retry with updated preview
- [ ] Market closed while betting → Clear notification

---

## 🎨 Design Requirements

### Betting Interface
```
[< Volver] Apostar en Market

¿Ganará América la Liga MX?

┌─────────────────────────────┐
│ Actual: 67% SÍ | 33% NO     │
└─────────────────────────────┘

Tu apuesta:
◉ SÍ  ○ NO

Monto: [Input] USDC [MAX]
Quick: [$5] [$10] [$25]

Preview:
• Recibirás: ~45.2 shares SÍ
• Precio promedio: $0.67 por share
• Potential ganancia: $67.8 (+45%)

Fees:
• Gas fee: ~$0.02
• Protocol fee: $0.60 (2%)

Después de tu apuesta:
Nuevas odds: 69% SÍ | 31% NO

[CONFIRMAR APUESTA - $30.62 total]

Balance: $1,234.56 USDC
```

### States y Feedback
- **Default:** Clean input form
- **Calculating:** Loading spinner en preview
- **Valid:** Green checkmark + clear preview
- **Invalid:** Red warning + specific error
- **Processing:** Loading + "Submitting bet..."
- **Success:** Green check + "Bet placed successfully!"
- **Error:** Red X + retry options

---

## 🔧 Technical Requirements

### Smart Contract Integration
```typescript
// Bet Placement Hook
const usePlaceBet = () => {
  return useMutation({
    mutationFn: async ({ marketId, side, amount }) => {
      const contract = getMarketContract(marketId);
      return contract.placeBet(side === 'yes', parseUSDC(amount));
    },
    onSuccess: (txHash) => {
      // Update cache, show success
      queryClient.invalidateQueries(['market', marketId]);
      toast.success('Bet placed!');
    },
    onError: (error) => {
      // Parse error type and show appropriate message
      handleTransactionError(error);
    }
  });
};

// Real-time Preview
const useBetPreview = (marketId, side, amount) => {
  return useQuery({
    queryKey: ['bet-preview', marketId, side, amount],
    queryFn: () => calculateBetOutcome({ marketId, side, amount }),
    enabled: amount > 0,
    refetchInterval: 5000, // Update every 5s
  });
};
```

### Validation Logic
```typescript
const validateBet = (amount: number, balance: number, minBet: number) => {
  if (amount < minBet) return 'Minimum bet is $0.01';
  if (amount > balance) return 'Insufficient balance';
  if (amount > maxBet) return 'Maximum bet exceeded';
  return null;
};
```

### Gas Estimation
- Estimate gas before transaction
- Display estimated cost in USD
- Handle gas price fluctuations
- Paymaster integration (Base sponsorship)

---

## 🗃️ Data Flow

### Bet Preview Calculation
```typescript
interface BetPreview {
  shares: number;
  avgPrice: number;
  potentialWinnings: number;
  protocolFee: number;
  gasFee: number;
  priceImpact: number;
  newOdds: { yes: number; no: number };
  slippage: number;
}
```

### Transaction States
```typescript
type BetState = 
  | 'idle'
  | 'validating'
  | 'previewing' 
  | 'confirming'
  | 'pending'
  | 'success'
  | 'error';
```

---

## 🧪 Test Scenarios

### Happy Path Flow
1. Usuario llega desde market detail
2. Selecciona SÍ o NO
3. Ingresa monto válido
4. Ve preview actualizado
5. Confirma transacción
6. Ve loading state
7. Recibe confirmación + tx hash
8. Balance actualizado
9. Regresa a market con nueva posición

### Validation Scenarios
1. **Monto muy bajo:** Error inmediato
2. **Monto > balance:** Clear error message
3. **Market cerrado:** Transaction blocked
4. **Network congestion:** Gas warning
5. **Large bet:** Slippage warning

### Error Recovery
1. **Transaction rejected:** Clear retry flow
2. **Network timeout:** Retry mechanism
3. **Insufficient gas:** Gas estimation update
4. **Contract error:** Human-readable message

### Edge Cases
1. **Balance changes during bet:** Re-validation
2. **Odds change significantly:** Updated preview
3. **Market closes while betting:** Graceful handling
4. **Very large amounts:** Scientific notation

---

## 📱 Mobile Experience

### Touch Optimization
- Large betting buttons (min 48px)
- Easy SÍ/NO toggle
- Numeric keypad for input
- Thumb-friendly quick amounts

### Performance
- Instant preview updates (<200ms)
- Smooth animations
- No UI blocking during calculation
- Efficient re-renders

### Accessibility
- Clear labels para screen readers
- High contrast mode support
- Focus management
- Error announcements

---

## 🔗 Dependencies

### Critical Blockers
- [ ] KIN-003 (Market Detail) navigation
- [ ] Smart contracts deployed + tested
- [ ] USDC balance reading
- [ ] Gas estimation API

### Integrations
- [ ] Transaction monitoring
- [ ] Push notifications (success/failure)
- [ ] Analytics events
- [ ] Error logging

---

## ⛽ Gas & Fee Handling

### Gas Optimization
- Batch operations donde sea posible
- Efficient contract calls
- Gas estimation pre-transaction
- Base Paymaster integration

### Fee Transparency
- All fees shown upfront
- No hidden costs
- Clear breakdown
- USD conversion

---

## 📊 Success Metrics

### Conversion KPIs  
- Bet completion rate: >85% (from preview to success)
- Average time to complete: <30s
- Error rate: <5% of attempts
- Retry success rate: >70%

### User Experience
- Preview calculation time: <200ms
- Transaction confirmation: <10s average
- User satisfaction: Low support tickets
- Repeat betting rate: >40%

---

## 🚨 Risk Mitigation

| Risk | Impact | Mitigation |
|------|--------|------------|
| High gas fees | High | Paymaster + clear warnings |
| Transaction failures | High | Robust retry logic |
| Slippage issues | Medium | Real-time previews + warnings |
| User confusion | Medium | Clear UI + error messages |
| Contract bugs | High | Extensive testing + limits |

---

## 📋 Implementation Plan

### Day 1: Core Betting Flow
- Bet form UI implementation
- Basic validation logic
- Amount input + quick selectors
- SÍ/NO toggle

### Day 2: Smart Contract Integration
- Contract call implementation
- Transaction state management
- Error handling
- Gas estimation

### Day 3: Polish + Testing
- Preview calculation optimization
- Mobile UX improvements
- Comprehensive error scenarios
- End-to-end testing
- Performance optimization

---

**Created:** October 13, 2025  
**Updated:** October 13, 2025  
**Status:** 📋 Ready for Development