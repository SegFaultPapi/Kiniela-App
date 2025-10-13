# KIN-001: Conectar Wallet Automáticamente

**Epic:** Usuario Consumidor  
**Priority:** P0 (Blocker)  
**Estimate:** 3 days  
**Phase:** 2 - Core User Experience

---

## 📋 User Story

**Como** usuario de Base App  
**Quiero** que mi wallet se conecte automáticamente al abrir Kiniela  
**Para** empezar a apostar inmediatamente sin fricciones

---

## ✅ Acceptance Criteria

### AC-001: Detección Automática Base App Wallet
- [ ] La app detecta automáticamente si está corriendo dentro de Base App
- [ ] Si está en Base App, conecta wallet sin user interaction
- [ ] Muestra balance de USDC inmediatamente después de conexión
- [ ] Loading state mientras se conecta (<2s)

### AC-002: Auto-conexión Sin Pasos Adicionales  
- [ ] Zero-click wallet connection en Base App environment
- [ ] Address del usuario visible en header después de conexión
- [ ] Balance actualizado en tiempo real
- [ ] Persistencia de conexión entre sesiones

### AC-003: Fallback para Wallets Externos
- [ ] Si no está en Base App, mostrar botón "Connect Wallet"
- [ ] WalletConnect modal para wallets externos
- [ ] Support para MetaMask, Rainbow, Coinbase Wallet
- [ ] Clear messaging sobre funcionalidades limitadas fuera de Base App

### AC-004: Manejo de Errores
- [ ] Error message si no hay wallet instalado
- [ ] Retry mechanism para conexiones fallidas  
- [ ] Clear CTA para instalar Base App si no está disponible
- [ ] Graceful degradation para unsupported wallets

---

## 🎨 Design Requirements

### Header Component
```
[Kiniela Logo] ... [Balance: $123.45 USDC] [0x1234...5678]
```

### Connection States
- **Loading:** Spinner + "Connecting wallet..."
- **Connected:** Address + Balance visible
- **Error:** Error message + "Try Again" button
- **Not Available:** "Install Base App" CTA

### Mobile-First
- Touch-friendly buttons (min 44px)
- Clear visual hierarchy
- Fast loading indicators

---

## 🔧 Technical Requirements

### Frontend Implementation
```typescript
// Base App Detection
const isBaseApp = window.ethereum?.isBaseApp || false;

// Wagmi Configuration
const config = createConfig({
  chains: [base],
  connectors: [
    baseConnector(), // Priority 1
    walletConnect(), // Fallback
  ],
  transports: {
    [base.id]: http(),
  },
});

// Auto-connect Hook
const useAutoConnect = () => {
  const { connect } = useConnect();
  
  useEffect(() => {
    if (isBaseApp) {
      connect({ connector: baseConnector });
    }
  }, []);
};
```

### Integration Points
- **Wagmi v2:** Para wallet connection management
- **Viem:** Para blockchain interactions  
- **Base App SDK:** Para native wallet access
- **USDC Contract:** Para balance queries

---

## 🧪 Test Scenarios

### Happy Path
1. Usuario abre app en Base App → Wallet conecta automáticamente
2. Balance USDC se muestra correctamente
3. Address visible en header
4. Navegación mantiene conexión

### Edge Cases
1. **No Wallet:** Clear error + install instructions
2. **Connection Failed:** Retry mechanism works
3. **Wrong Network:** Auto-switch to Base o clear error
4. **Low Balance:** Warning pero app funciona
5. **External Wallet:** Fallback a WalletConnect

### Error Scenarios
1. Network timeout → Retry logic
2. User rejects connection → Clear messaging
3. Wallet locked → Unlock instructions
4. Unsupported wallet → Graceful degradation

---

## 📱 Mobile Testing Checklist

### iOS Safari
- [ ] Touch events work correctly
- [ ] Viewport meta tag configured
- [ ] Connection persists through tab switches
- [ ] Native share works (if applicable)

### Android Chrome  
- [ ] Wallet detection works
- [ ] Performance acceptable (<2s load)
- [ ] Memory usage optimized
- [ ] Connection stable

---

## 🔗 Dependencies

### Blockers
- [ ] Base Mini Kit setup completado
- [ ] Smart contracts deployed en testnet
- [ ] USDC token contract address configured

### Parallel Work
- [ ] Database schema para user sessions
- [ ] API endpoints para balance queries
- [ ] Error logging/monitoring setup

---

## 📊 Success Metrics

### Technical KPIs
- Connection success rate: >95%
- Connection time: <2s average
- Error rate: <5% of attempts
- Retention after connection: >90%

### User Experience
- Zero-friction onboarding
- Clear error recovery paths
- Consistent UI state management
- Mobile performance optimized

---

## 🚨 Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Base App API changes | Version pinning + fallback |
| Network connectivity issues | Retry logic + offline states |
| Wallet compatibility problems | Comprehensive testing matrix |
| User confusion | Clear error messages + help docs |

---

## 📋 Implementation Notes

### Phase 1: Core Connection
- Basic Base App wallet detection
- Auto-connect functionality  
- Balance display
- Error handling

### Phase 2: Polish
- Loading animations
- Error message improvements
- Performance optimization
- Comprehensive testing

### Phase 3: Fallbacks
- WalletConnect integration
- External wallet support
- Connection persistence
- Edge case handling

---

**Created:** October 13, 2025  
**Updated:** October 13, 2025  
**Status:** 📋 Ready for Development