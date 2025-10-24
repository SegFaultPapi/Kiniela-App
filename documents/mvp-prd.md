# Product Requirements Document (PRD) - Kiniela App MVP

**Version:** 1.0  
**Fecha:** Octubre 2025  
**Proyecto:** Kiniela App - Plataforma de Prediction Markets en Base  

---

## 1. Project Overview

### Problema
Los usuarios latinos no tienen una forma simple y confiable de crear y participar en mercados de predicción personalizados. Las plataformas existentes son complejas, poco transparentes y no permiten la personalización que demandan los usuarios para apostar en eventos específicos de sus comunidades.

### Objetivos
- **Objetivo Principal:** Crear la plataforma más simple de LatAm para prediction markets binarios con creación instantánea de mercados personalizados
- **Usuarios Activos:** 100 usuarios en las primeras 4 semanas
- **Markets Creados:** 50+ markets custom en el primer mes  
- **Transacciones:** 200+ apuestas completadas en 30 días
- **Retención:** 40% de usuarios regresan en semana 2

### Usuario Target Primario
**Apostador Social Informal (Persona #2):**
- Edad: 23-28 años
- Perfil: Profesionistas jóvenes (TI, ingeniería)
- Comportamiento: Apuesta informalmente con familia/amigos
- Pain Point: Falta de confianza en apuestas grupales
- Presupuesto: $100-2,000 MXN/mes

### Value Proposition
**"Cobra apuestas entre amigos sin discusiones + crea markets sobre lo que te importa"**

**Diferenciación:**
- vs WhatsApp/efectivo: Transparencia total, resolución automática
- vs Polymarket: Markets personalizados en segundos, no solo macro-eventos
- vs Casas tradicionales: Peer-to-peer sin house edge, onboarding en 30 segundos

***

## 2. User Stories & Acceptance Criteria

### Epic 1: Usuario Consumidor

#### US-001: Conectar Wallet Automáticamente
**Como** usuario de Base App  
**Quiero** que mi wallet se conecte automáticamente al abrir Kiniela  
**Para** empezar a apostar inmediatamente sin fricciones

**Acceptance Criteria:**
- [ ] Detección automática de Base App wallet
- [ ] Auto-conexión sin pasos adicionales
- [ ] Fallback para wallets externos (WalletConnect)
- [ ] Manejo de error si no hay wallet conectado

#### US-002: Ver Feed de Markets Activos
**Como** usuario consumidor  
**Quiero** ver una lista simple de markets activos destacados  
**Para** encontrar rápidamente dónde apostar

**Acceptance Criteria:**
- [ ] Lista ordenada por actividad (más apuestas recientes primero)
- [ ] Mostrar: título, % SÍ/NO, pool total, tiempo restante
- [ ] Máximo 20 markets por página
- [ ] Pull-to-refresh para actualizar
- [ ] Loading states apropiados

#### US-003: Ver Detalle de Market
**Como** usuario consumidor  
**Quiero** ver todos los detalles de un market antes de apostar  
**Para** tomar una decisión informada

**Acceptance Criteria:**
- [ ] Título y descripción completa del market
- [ ] Porcentaje actual SÍ/NO con visualización clara
- [ ] Pool total en USDC
- [ ] Fecha y hora de cierre
- [ ] Botones prominentes "Apostar SÍ" / "Apostar NO"
- [ ] Estimación de shares que recibiría por X monto

#### US-004: Realizar Apuesta
**Como** usuario consumidor  
**Quiero** apostar en un outcome (SÍ/NO) con monto específico  
**Para** participar en el market

**Acceptance Criteria:**
- [ ] Seleccionar SÍ o NO
- [ ] Input para monto en USDC
- [ ] Preview de shares que recibirá
- [ ] Confirmación de transacción
- [ ] Feedback de éxito/error
- [ ] Update automático de balance

#### US-005: Claim Winnings
**Como** usuario ganador  
**Quiero** reclamar mis ganancias cuando el market se resuelva  
**Para** recibir mis tokens ganados

**Acceptance Criteria:**
- [ ] Botón "Claim" visible solo en markets ganadores resueltos
- [ ] Mostrar cantidad a recibir antes de confirmar
- [ ] Transacción automática via smart contract
- [ ] Actualización de balance post-claim
- [ ] Histórico de claims realizados

#### US-006: Ver Mis Posiciones
**Como** usuario consumidor  
**Quiero** ver todos los markets donde he apostado  
**Para** hacer seguimiento de mis inversiones

**Acceptance Criteria:**
- [ ] Tab dedicado "Mis Posiciones"
- [ ] Lista con markets activos donde participé
- [ ] Mostrar: mi posición (SÍ/NO), monto apostado, valor actual
- [ ] Status: activo, pendiente resolución, ganado, perdido
- [ ] Filtros: activos, histórico, ganados, perdidos

### Epic 2: Usuario Creador

#### US-007: Crear Market Básico
**Como** usuario creador  
**Quiero** crear un market de predicción binario  
**Para** que otros puedan apostar en mi evento

**Acceptance Criteria:**
- [ ] Formulario simple: título (max 120 chars), descripción (max 500 chars)
- [ ] Selector de fecha/hora de cierre
- [ ] Solo outcomes binarios (SÍ/NO)
- [ ] Fee de creación: $0.25 USD
- [ ] Validación de inputs
- [ ] Confirmación de transacción

#### US-008: Configurar Market
**Como** usuario creador  
**Quiero** configurar parámetros básicos de mi market  
**Para** controlar cómo funciona

**Acceptance Criteria:**
- [ ] Solo token USDC (no selección)
- [ ] Límite máximo por apuesta (opcional)
- [ ] Vista previa del market antes de crear
- [ ] Estimación de fees y costos
- [ ] Opción de cancelar antes de confirmar

#### US-009: Generar Link Compartible
**Como** usuario creador  
**Quiero** obtener un link directo a mi market  
**Para** compartirlo con mi círculo social

**Acceptance Criteria:**
- [ ] Generación automática de link único
- [ ] Botón "Copiar link" con feedback
- [ ] Link directo a detalle del market
- [ ] Compatible con native share (iOS/Android)
- [ ] Preview del market en el link (Open Graph)

#### US-010: Ver Participantes
**Como** usuario creador  
**Quiero** ver quién está participando en mi market  
**Para** monitorear la actividad

**Acceptance Criteria:**
- [ ] Lista de addresses que han apostado
- [ ] Mostrar posición de cada uno (SÍ/NO + monto)
- [ ] Total de participantes únicos
- [ ] Distribución porcentual SÍ/NO
- [ ] Actualización en tiempo real

#### US-011: Resolver Market
**Como** usuario creador  
**Quiero** resolver el resultado de mi market cuando termine el evento  
**Para** que los ganadores puedan reclamar

**Acceptance Criteria:**
- [ ] Botón "Resolver" visible solo después del cierre
- [ ] Opciones: "SÍ ganó", "NO ganó"
- [ ] Confirmación antes de resolver (irreversible)
- [ ] Distribución automática via smart contract
- [ ] Notificación a participantes
- [ ] No opción de reembolso en MVP

---

## 3. UI/UX Requirements

### Wireframes Principales

#### Pantalla 1: Feed de Markets
```
[Header: Kiniela + Balance USDC]
[Tab Bar: Feed | Mis Markets | Crear]

[Market Card 1]
- "¿Ganará América la Liga MX?"
- 67% SÍ | 33% NO
- Pool: $2,340 USDC | 2h restantes
- [>]

[Market Card 2]
- "¿llueve mañana en CDMX?"
- 23% SÍ | 77% NO  
- Pool: $156 USDC | 18h restantes
- [>]

[+ Crear Market] (FAB)
```

#### Pantalla 2: Detalle de Market
```
[< Volver] [Share]

"¿Ganará América la Liga MX?"

Descripción: "Market sobre el partido América vs Cruz Azul del domingo 15 de octubre a las 8pm..."

[Gráfico circular: 67% SÍ | 33% NO]

Pool total: $2,340 USDC
Cierra: 15 Oct, 8:00 PM

Tu apuesta: [Input] USDC
Recibirías: ~45.2 shares

[APOSTAR SÍ - $$$] [APOSTAR NO - $$$]

Creado por: 0x1234...5678
```

#### Pantalla 3: Crear Market
```
[< Cancelar] Crear Market [Siguiente]

Título
[Input: "¿Qué va a pasar?"]

Descripción  
[TextArea: "Describe el evento..."]

Fecha de cierre
[Date Picker: 15 Oct 2025, 8:00 PM]

[Vista Previa] [Crear Market - $0.25]
```

### User Flow Crítico

#### Flow 1: Apostar (Consumidor)
1. Abrir app → wallet conectado automáticamente
2. Ver feed → tap en market de interés
3. Leer detalles → decidir SÍ/NO
4. Ingresar monto → ver preview de shares
5. Confirmar → transacción → feedback éxito
6. Regresar a feed o ver posiciones

#### Flow 2: Crear Market (Creador)
1. Tap FAB "Crear Market"
2. Completar formulario (título, descripción, fecha)
3. Preview del market
4. Confirmar → pagar $0.25 → market live
5. Copiar link → compartir
6. Monitorear participantes → resolver al cierre

### Principios de Diseño

#### Simplicidad Extrema
- Máximo 3 taps para cualquier acción principal
- Zero onboarding (wallet ya conectado)
- Visual hierarchy clara con contraste alto
- Textos grandes, botones prominentes

#### Confianza y Transparencia
- Mostrar siempre fees upfront
- Address del creador visible
- Pool total y distribución clara
- Confirmaciones para acciones irreversibles

#### Mobile First
- Touch targets mínimo 44px
- Thumb-friendly navigation
- Swipe gestures donde tenga sentido
- Offline states apropiados

***

## 4. Technical Requirements

### Stack Técnico

#### Smart Contracts (Base Mainnet)
- **Lenguaje:** Solidity ^0.8.19
- **Framework:** Hardhat + Base Mini Kit
- **Arquitectura:** AMM simple (constant product x*y=k)
- **Token:** Solo USDC (0xa0b86991c431714C5F7e4c0bE77d79C8A9b8f2c3d en Base)
- **Oracle:** Manual resolution por creator (MVP)
- **Deployments:** Testnet primero, mainnet en semana 4

#### Frontend (Base App Integration)
- **Framework:** Next.js 14 (App Router)
- **Wallet:** Wagmi + Viem para Base App wallet
- **UI:** shadcn/ui + Tailwind CSS
- **State:** Zustand (minimal)
- **API:** tRPC para type safety
- **Hosting:** Vercel (Edge runtime)

#### Backend (Minimal)
- **Database:** Supabase (PostgreSQL)
- **API:** Next.js API routes + tRPC
- **Indexing:** Event listeners para smart contract
- **Caching:** Vercel Edge cache + SWR

### Integraciones Requeridas

#### Base App Integration
- Auto-connect wallet via Base App
- USDC token contract interaction
- Paymaster integration (gas fees sponsored)
- Base App feed integration (post-MVP)

#### Farcaster Integration  
- Share markets con Open Graph preview
- Social login como alternativa (post-MVP)
- Frame integration para betting (post-MVP)

### Performance Requirements
- **Load time:** <2s primera carga
- **Transaction time:** <5s confirmation
- **Uptime:** 99.5% availability
- **Concurrent users:** Hasta 1,000 simultáneos

### Security Requirements
- **Smart contract:** Audit antes de mainnet (diferir si presupuesto ajustado)
- **Frontend:** CSP headers, no inline scripts
- **API:** Rate limiting, input validation
- **Wallet:** Solo lectura de balances, no private keys

### Technical Constraints
- **Gas fees:** Sponsoreadas por Base Paymaster
- **File storage:** Solo metadata en DB, no images
- **Mobile:** PWA-ready, no native apps inicialmente
- **Browsers:** Chrome 90+, Safari 14+, Firefox 88+

---

## 5. Success Metrics

### Métricas de Adopción (4 semanas)
- **Usuarios registrados:** 100 (25/semana)
- **Markets creados:** 50 (12.5/semana)  
- **Total apuestas:** 200 (50/semana)
- **GMV (Gross Merchandise Value):** $5,000+ USD

### Métricas de Engagement
- **Daily Active Users:** 20+ (semana 4)
- **Markets por usuario:** 0.5 promedio
- **Apuestas por usuario:** 2+ promedio
- **Time on app:** 5+ minutos por sesión
- **Return rate:** 40% semana 2, 25% semana 4

### Métricas de Producto
- **Market resolution rate:** 95% (creators resuelven)
- **Transaction success rate:** 98%+ 
- **Average market pool:** $100+ USD
- **Creator retention:** 60% crean segundo market

### Métricas de Revenue
- **Creation fees:** $12.5+ (50 markets × $0.25)
- **Trading fees:** $200+ (2% de $10k GMV)
- **Total revenue:** $212+ primera mes

### KPIs de Calidad
- **App crashes:** <1% de sesiones
- **Failed transactions:** <2%
- **Support tickets:** <5 por semana
- **Average resolution time:** <24h

### Métricas de Growth
- **Organic sharing:** 30% markets shared
- **Referral rate:** 20% users invitan friends
- **Farcaster mentions:** 10+ posts orgánicos
- **Community feedback:** 4.2+ rating promedio

***

## 6. Implementation Roadmap

### Phase 1: Smart Contract Foundation (Semana 1)
**Entregables:**
- [ ] Market creation contract con bonding curve
- [ ] Binary betting logic (SÍ/NO outcomes)
- [ ] USDC integration en Base testnet
- [ ] Creator resolution mechanism
- [ ] Events para frontend tracking
- [ ] Unit tests completos (90%+ coverage)
- [ ] Testnet deployment + verification

**Definition of Done:**
- Contract deployado en Base Sepolia
- 10+ markets de prueba creados y resueltos
- Gas costs optimizados (<$0.50 por transacción)

### Phase 2: Core User Experience (Semana 2)
**Entregables:**
- [ ] Base App wallet auto-connection
- [ ] Market feed con datos reales
- [ ] Market detail page funcional
- [ ] Place bet flow completo
- [ ] Real-time updates via events
- [ ] Basic error handling
- [ ] Mobile-responsive design

**Definition of Done:**
- Usuario puede conectar wallet y apostar end-to-end
- UI funciona en iOS Safari y Android Chrome
- Loading states y error states implementados

### Phase 3: Market Creation + Resolution (Semana 3)
**Entregables:**
- [ ] Create market form y validation
- [ ] Market configuration options
- [ ] Shareable links generation
- [ ] Participants view para creators
- [ ] Market resolution interface
- [ ] Claim winnings flow
- [ ] "Mis Posiciones" tab

**Definition of Done:**
- Creator puede crear, compartir y resolver market
- Winners pueden claim automáticamente
- Link sharing funciona en WhatsApp/Farcaster

### Phase 4: Polish + Mainnet (Semana 4)
**Entregables:**
- [ ] UI/UX polish y micro-interactions
- [ ] Performance optimization
- [ ] Analytics tracking (PostHog)
- [ ] Error monitoring (Sentry)
- [ ] Mainnet deployment
- [ ] Smart contract verification
- [ ] Production monitoring setup

**Definition of Done:**
- App live en mainnet con USDC real
- <2s load times, 98%+ uptime
- Analytics tracking usuarios reales

### Post-MVP Iterations (Semanas 5-8)

#### Iteration 1: Social Features
- [ ] Farcaster frames integration
- [ ] Share winnings en social media
- [ ] Friend notifications
- [ ] Basic profiles (ENS integration)

#### Iteration 2: Advanced Features  
- [ ] Market categories y filters
- [ ] Search functionality
- [ ] Push notifications
- [ ] Advanced analytics dashboard

#### Iteration 3: Growth + Retention
- [ ] Referral system
- [ ] Creator badges/reputation
- [ ] Market templates
- [ ] API for third-party integrations

### Risk Mitigation

#### Technical Risks
- **Smart contract bugs:** Extensive testing + audit pre-mainnet
- **Base network issues:** Fallback UI states + status page
- **Wallet integration:** Thorough testing con Base App beta

#### Product Risks  
- **Low adoption:** Pre-launch en comunidades target
- **Poor UX:** User testing con personas reales
- **Creator reluctance:** Incentivos tempranos para creators

#### Business Risks
- **Regulatory:** Legal review antes de mainnet
- **Competition:** Speed to market + unique UX
- **Monetization:** Flexible fee structure

***

## Definición de Success

**El MVP es exitoso si en 4 semanas tenemos:**
1. **100 usuarios** han conectado wallet y usado la app
2. **50 markets** creados por la comunidad (no equipo)  
3. **200 apuestas** completadas con dinero real
4. **40% retention rate** (users regresan en semana 2)
5. **95% resolution rate** (creators resuelven sus markets)

**Criterios de Go/No-Go para siguientes fases:**
- **Go:** ≥80% de métricas objetivo alcanzadas
- **Pivot:** 50-80% métricas + clara dirección de mejora
- **No-Go:** <50% métricas + sin tracción orgánica

***

**Próximos pasos inmediatos:**
1. Setup development environment (Base Mini Kit)
2. Deploy smart contract en testnet
3. Crear primeros 5 markets de prueba
4. User testing con personas target (semana 2)

*Este PRD será actualizado semanalmente basado en learnings y feedback real de usuarios.*