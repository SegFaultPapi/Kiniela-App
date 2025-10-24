# ST-003: Smart Contract Development Setup

## Epic
Sprint 0: Project Setup & Development Environment

## Story
**Como desarrollador de blockchain**
Quiero configurar el entorno de desarrollo para smart contracts con Hardhat
**Para poder** desarrollar, compilar, testear y desplegar contratos en Base

## Description
Configuración completa de Hardhat para desarrollo de smart contracts, incluyendo conexión a Base testnet (Sepolia), configuración de wallets de desarrollo, y setup inicial de testing framework.

## Acceptance Criteria
- [ ] Hardhat instalado y configurado
- [ ] Configuración de networks (local, Base Sepolia, Base Mainnet)
- [ ] Wallet de desarrollo configurado con testnet ETH
- [ ] Solidity 0.8.19 configurado como compilador
- [ ] Framework de testing configurado (Mocha/Chai)
- [ ] Scripts de deploy básicos creados
- [ ] Verificación de contratos configurada
- [ ] Configuración de gas reporting

## Technical Requirements
- Hardhat 2.17.0 o superior
- Solidity 0.8.19
- Base Sepolia testnet configurado
- Wallet con testnet ETH (al menos 0.1 ETH)
- OpenZeppelin contracts instalado

## Definition of Done
- [ ] `pnpm hardhat compile` ejecuta sin errores
- [ ] `pnpm hardhat test` ejecuta tests básicos
- [ ] `pnpm hardhat node` levanta network local
- [ ] Conexión a Base Sepolia funcional y verificada
- [ ] Deploy script ejecuta correctamente en testnet
- [ ] Wallet de desarrollo tiene balance suficiente
- [ ] Configuración de verificación en Basescan

## Priority
**Crítico** - Blocker para desarrollo de contratos

## Effort Estimate
5 hours

## Dependencies
- ST-001: Development Environment Setup
- ST-002: Project Structure & Initial Configuration

## Notes
- Usar configuración recomendada de Base para Hardhat
- Configurar múltiples accounts para testing
- Documentar proceso de funding de testnet wallet
- Configurar gas price apropiado para Base
- Guardar private keys de desarrollo de forma segura