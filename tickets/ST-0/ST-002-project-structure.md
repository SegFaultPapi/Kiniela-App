# ST-002: Project Structure & Initial Configuration

## Epic
Sprint 0: Project Setup & Development Environment

## Story
**Como desarrollador**
Quiero crear la estructura inicial del proyecto Kiniela con todas las configuraciones base
**Para poder** empezar el desarrollo de forma organizada y escalable

## Description
Creación de la estructura de carpetas, configuración inicial de Next.js 14 con TypeScript, Tailwind CSS, y integración con Base Mini Kit. Incluye configuración de herramientas de desarrollo y linting.

## Acceptance Criteria
- [ ] Proyecto Next.js 14 con App Router configurado
- [ ] TypeScript configurado con tsconfig.json optimizado
- [ ] Tailwind CSS instalado y configurado
- [ ] shadcn/ui instalado con componentes base
- [ ] Estructura de carpetas creada:
  - `/app` - App Router pages
  - `/components` - UI components
  - `/lib` - Utilities y helpers
  - `/contracts` - Smart contracts (Hardhat)
  - `/public` - Assets estáticos
- [ ] ESLint y Prettier configurados
- [ ] Package.json con scripts necesarios

## Technical Requirements
- Next.js 14.0.0 o superior
- TypeScript 5.0.0 o superior
- Tailwind CSS 3.3.0 o superior
- shadcn/ui latest
- ESLint configuración recomendada

## Definition of Done
- [ ] `pnpm dev` ejecuta la aplicación sin errores
- [ ] `pnpm build` compila exitosamente
- [ ] `pnpm lint` no muestra errores críticos
- [ ] Página de inicio carga con "Hello Kiniela" 
- [ ] Tailwind CSS funcionando (estilos aplicados)
- [ ] TypeScript compile sin errores

## Priority
**Crítico** - Blocker para desarrollo frontend

## Effort Estimate
6 hours

## Dependencies
- ST-001: Development Environment Setup

## Notes
- Usar configuración recomendada de Base para Next.js
- Instalar solo componentes shadcn/ui que necesitaremos
- Configurar absolute imports con @ alias
- Seguir estructura de carpetas de Base Mini Kit