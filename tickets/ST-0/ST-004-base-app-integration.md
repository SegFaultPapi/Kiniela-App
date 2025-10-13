# ST-004: Base App Integration & Wallet Setup

## Epic
Sprint 0: Project Setup & Development Environment

## Story
**Como desarrollador frontend**
Quiero configurar la integración con Base App y el sistema de wallet connection
**Para poder** habilitar la conexión automática de wallets y interactuar con Base

## Description
Configuración de la integración con Base App, incluyendo Wagmi, Viem, y la configuración de providers para wallet connection. Setup de Base App wallet como opción principal con fallback a WalletConnect.

## Acceptance Criteria
- [ ] Wagmi configurado con Base App provider
- [ ] Viem configurado para Base network
- [ ] Base App wallet detection funcionando
- [ ] WalletConnect como fallback configurado
- [ ] Componente de conexión de wallet creado
- [ ] Estado de wallet connection manejado globalmente
- [ ] Manejo de errores de conexión implementado
- [ ] Network switching configurado (Sepolia ↔ Mainnet)

## Technical Requirements
- Wagmi 2.0.0 o superior
- Viem 2.0.0 o superior
- Base App integration configurada
- WalletConnect v3 o superior
- React Context para estado global

## Definition of Done
- [ ] Wallet connection funciona en Base App environment
- [ ] WalletConnect funciona como fallback
- [ ] Estado de conexión se mantiene al recargar página
- [ ] Switch network funciona correctamente
- [ ] Error states manejados apropiadamente
- [ ] Loading states durante conexión funcionan
- [ ] Disconnect wallet funciona correctamente

## Priority
**Crítico** - Blocker para funcionalidades de wallet

## Effort Estimate
6 hours

## Dependencies
- ST-001: Development Environment Setup  
- ST-002: Project Structure & Initial Configuration

## Notes
- Seguir documentación oficial de Base App integration
- Configurar providers en orden de preferencia (Base App → WalletConnect)
- Testear en diferentes browsers y dispositivos
- Considerar SSR compatibility
- Documentar flow de wallet connection para usuarios