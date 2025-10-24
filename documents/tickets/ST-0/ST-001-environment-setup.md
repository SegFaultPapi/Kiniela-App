# ST-001: Development Environment Setup

## Epic
Sprint 0: Project Setup & Development Environment

## Story
**Como desarrollador**
Quiero configurar el entorno de desarrollo local con todas las herramientas necesarias
**Para poder** desarrollar, compilar y desplegar la aplicación Kiniela

## Description
Configuración inicial del entorno de desarrollo local incluyendo todas las herramientas, frameworks y dependencias necesarias para el desarrollo del MVP de Kiniela App.

## Acceptance Criteria
- [ ] Node.js 18+ instalado y configurado
- [ ] Instalación de pnpm como package manager
- [ ] Git configurado con SSH keys para repositorio
- [ ] VS Code configurado con extensiones necesarias:
  - Solidity
  - Tailwind CSS IntelliSense  
  - Prettier
  - ESLint
- [ ] Base Mini Kit clonado y funcionando locally
- [ ] Configuración de variables de entorno local (.env.local)

## Technical Requirements
- Node.js versión 18.17.0 o superior
- pnpm versión 8.0.0 o superior
- Git versión 2.40.0 o superior
- VS Code o IDE equivalente

## Definition of Done
- [ ] Comando `node --version` retorna 18+
- [ ] Comando `pnpm --version` funciona correctamente
- [ ] Base Mini Kit se ejecuta con `pnpm dev` sin errores
- [ ] Variables de entorno configuradas y validadas
- [ ] Primer commit realizado en repositorio

## Priority
**Crítico** - Blocker para todos los demás tickets

## Effort Estimate
4 hours

## Dependencies
- Ninguna

## Notes
- Usar Base Mini Kit oficial: https://github.com/coinbase/base-mini-kit
- Seguir guías de configuración oficiales de Base
- Documentar cualquier issue durante setup