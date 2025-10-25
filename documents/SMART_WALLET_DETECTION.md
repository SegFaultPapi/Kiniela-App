# 🔍 Detección de Smart Wallets de Base

Este documento explica cómo la app detecta y maneja Smart Wallets (Account Abstraction) de Base.

## ✅ Configuración Actual

### 1. Wagmi Configuration (`lib/wagmi.ts`)
```typescript
coinbaseWallet({
  appName: 'Kiniela',
  appLogoUrl: '/icon.png',
  preference: 'smartWalletOnly', // ← Prioriza Smart Wallets
  version: '4', // ← SDK v4 con soporte para AA
})
```

### 2. Detección de Capabilities
La app usa el hook `useCapabilities()` de Wagmi para detectar si la wallet conectada es una Smart Wallet:

```typescript
const { data: capabilities } = useCapabilities({
  account: address,
})
```

### 3. Características de Smart Wallet
Una Smart Wallet de Base tiene estas capabilities:
- ✅ **Atomic Batch**: Transacciones en lote
- ✅ **Paymaster Service**: Gasless transactions
- ✅ **Account Abstraction**: ERC-4337

## 🧪 Cómo Verificar si está Detectando Smart Wallets

### 1. Abrir la Consola del Navegador
Presiona `F12` o `Cmd+Option+I` (Mac) para abrir DevTools

### 2. Buscar estos Logs

#### Al conectar la wallet:
```
✅ Smart Wallet detectada correctamente!
```

#### Status de la wallet:
```javascript
🔗 Base App Wallet Status: {
  isConnected: true,
  walletType: "Smart Wallet",
  isSmartWallet: true,
  hasBaseAccountCapabilities: true,
  capabilitiesCount: 1
}
```

#### Información detallada:
```javascript
✅ Smart Wallet conectada: {
  address: "0x...",
  walletType: "Base Smart Wallet (Account Abstraction)",
  features: {
    atomicBatch: true,
    paymasterService: true
  }
}
```

### 3. Verificar en la UI

#### En el Header:
- 🟢 Punto verde animado = Wallet conectada
- ⚡ Rayo azul = Smart Wallet detectada (solo visible en pantallas medianas/grandes)

#### En el Dropdown de Wallet:
- Sección "⚡ Smart Wallet"
- Texto: "Account Abstraction habilitado"

## 🔧 Qué Buscar en Base App

### En Base App (Producción):
1. La wallet debería **auto-conectarse** automáticamente
2. No debería aparecer el botón "💼 Conectar"
3. Los logs deberían mostrar:
   ```
   ✅ KIN-001 - Base App Detection: { isInBaseApp: true }
   ```

### Fuera de Base App (Desarrollo):
1. Aparece el botón "💼 Conectar" en azul
2. Al hacer clic, se abre el modal de Coinbase Wallet
3. Después de conectar, verifica los logs de capabilities

## 🚨 Troubleshooting

### Smart Wallet NO Detectada
Si los logs muestran:
```javascript
walletType: "EOA/Regular Wallet"
isSmartWallet: false
capabilitiesCount: 0
```

**Posibles causas:**
1. **Wallet EOA tradicional**: El usuario conectó una wallet regular (MetaMask, etc)
2. **SDK desactualizado**: Verifica que `version: '4'` esté en la config
3. **Red incorrecta**: Asegúrate de estar en Base (chainId: 8453) o Base Sepolia (84532)

### Cómo Forzar Smart Wallet
En `lib/wagmi.ts`, verifica que tenga:
```typescript
preference: 'smartWalletOnly'
```

Esto rechaza wallets EOA y solo permite Smart Wallets.

## 📊 Capabilities Esperadas

Para una Smart Wallet de Base, deberías ver:
```javascript
{
  "8453": { // Base Mainnet
    "atomicBatch": { "supported": true },
    "paymasterService": { 
      "supported": true,
      "url": "https://..."
    }
  }
}
```

## 🔗 Referencias

- [Wagmi useCapabilities](https://wagmi.sh/react/api/hooks/useCapabilities)
- [Coinbase Smart Wallet Docs](https://docs.cdp.coinbase.com/wallet-sdk/docs/welcome)
- [ERC-4337 Account Abstraction](https://eips.ethereum.org/EIPS/eip-4337)

## 📝 Notas

- Las Smart Wallets solo están disponibles en Base y Base Sepolia
- El auto-connect solo funciona dentro de Base App
- Las capacidades se detectan después de conectar, no antes
- Si no hay capabilities, la wallet sigue funcionando como EOA normal

