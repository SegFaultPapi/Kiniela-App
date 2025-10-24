---

## 🎯 Problema Core

Participar en prediction markets es complicado y no existe forma fácil de crear mercados personalizados en español/LatAm[codiant+1](https://codiant.com/blog/web3-experiences-a-ui-ux-designers-guide/)

## 🔥 Flujo MVP (Usuario Consumidor)

1. Usuario abre app → wallet conectado automáticamente (Base App)
2. Ve feed de markets activos destacados
3. Tap en market → ve detalles (título, opciones, pool actual, fecha cierre)
4. Selecciona SÍ o NO → ingresa monto → confirma transacción
5. Al cerrar market → botón "Claim" visible → recibe ganancia/pérdida

## ✅ Features MVP - Consumidor

- **Auto-connect wallet** (Base App native)
- **Feed de markets** (lista simple, ordenada por actividad)
- **Detalle de market** (título, descripción, % SÍ/NO, pool total, fecha cierre)
- **Place bet** (SÍ/NO, input monto, preview de shares recibidos)
- **Claim winnings** (botón post-cierre, automático vía smart contract)
- **Mis posiciones** (tab simple con markets donde aposté)[obyte+2](https://blog.obyte.org/introducing-prophet-prediction-markets-based-on-bonding-curves-3716651db344)

## ✅ Features MVP - Creador

- **Crear market** (formulario: título, descripción, fecha cierre)
- **Configuración básica** (límite máximo por apuesta, token: USDC únicamente)
- **Generar link** (shareable link para compartir market)
- **Ver participantes** (lista de addresses + posiciones actuales)
- **Resolver market** (botón SÍ/NO al cierre → distribuye automáticamente)[ethresear+1](https://ethresear.ch/t/bonding-curve-implementation-for-prediction-markets-market-making-without-liquidity-providers-and-impermanent-losses/8046)

## ❌ NO va en MVP

- Múltiples tokens (solo USDC)
- Función de reembolso manual
- Share en redes sociales (usa native share)
- Categorías/filtros complejos
- Markets con más de 2 outcomes (solo SÍ/NO binario)
- Imágenes custom (solo texto/emoji)
- Sistema de reputación/rankings
- Comentarios o chat
- Histórico de ganancias/pérdidas[coinbound+1](https://coinbound.io/web3-ux-design-guide/)

## 🎊 Criterio de Éxito

**Mi MVP funciona si:** 10 usuarios crean markets Y 50+ apuestas totales en primera semana[tde](https://tde.fi/founder-resource/blogs/web3-strategy/how-web3-founders-can-leverage-prediction-markets-like-myriad/)

---

## 🛠️ Stack Técnico Recomendado

**Smart Contract:**

- Bonding curve simple (constant product AMM tipo x*y=k)
- Solo binary outcomes (SÍ/NO)
- Automatic settlement cuando creator resuelve
- Events para tracking[paradigm+2](https://www.paradigm.xyz/2024/11/pm-amm)

**Frontend (Base Mini Kit):**

- Wagmi/Viem para interactions
- USDC contract integration (Base)
- shadcn/ui para components
- Minimal state management[base+1](https://blog.base.org/the-state-of-base-at-basecamp-2025)

---

## ⚡ Build Order (4 semanas)

**Semana 1:** Smart contract + tests

**Semana 2:** Feed + detalle + place bet

**Semana 3:** Crear market + resolver

**Semana 4:** Polish + testnet → mainnet

---

## 🚨 Decisiones Críticas Tomadas

**1. SIN reembolso manual en MVP**

- Añade complejidad de autorización + lógica de cancelación
- Mejor: markets se resuelven SIEMPRE (winner takes all)
- Post-MVP: añade "void market" feature[block3finance](https://www.block3finance.com/the-legal-challenges-facing-crypto-betting-in-2025)

**2. Solo USDC**

- Evita conversión/pricing complexity
- Usuario target en LatAm entiende stablecoins
- Post-MVP: ETH, otros tokens[platinumcryptoacademy+1](https://www.platinumcryptoacademy.com/cryptocurrency-investment/the-crypto-gambling-boom-why-2025-is-the-year-to-bet-with-blockchain/)

**3. AMM simple vs orderbook**

- Constant product (Uniswap-style) para MVP
- Siempre hay liquidez
- Precio se ajusta dinámicamente
- Post-MVP: considera pm-AMM si necesitas precision[obyte+1](https://blog.obyte.org/introducing-prophet-prediction-markets-based-on-bonding-curves-3716651db344)

**4. Creator resuelve outcome**

- Centralizado pero funcional
- Post-MVP: oracles o voting mechanism
- Para MVP: trust en creator[block3finance+1](https://www.block3finance.com/the-legal-challenges-facing-crypto-betting-in-2025)

---

## ✅ Test Final

- [x]  **30 segundos:** "Kiniela permite apostar en prediction markets binarios en USDC desde Base App y crear tus propios markets en segundos"
- [x]  **Enfoque:** 5 features core para consumidor + 5 para creador
- [x]  **Problema específico:** Markets complicados + no poder crear personalizados