# ST-006: First Deployment & CI/CD Pipeline

## Epic
Sprint 0: Project Setup & Development Environment

## Story
**Como desarrollador**
Quiero configurar el pipeline de deployment y CI/CD 
**Para poder** desplegar la aplicación automáticamente y validar que todo funciona

## Description
Configuración de Vercel para hosting, setup de GitHub Actions para CI/CD, configuración de environment variables de producción, y primer deployment de "Hello World" para validar que todo el stack funciona correctamente.

## Acceptance Criteria
- [ ] Repositorio conectado a Vercel
- [ ] Primer deployment exitoso en Vercel
- [ ] Environment variables configuradas en Vercel
- [ ] GitHub Actions workflow configurado para:
  - Linting
  - Type checking  
  - Build verification
  - Tests (cuando existan)
- [ ] Custom domain configurado (opcional)
- [ ] SSL certificate configurado
- [ ] Deployment previews funcionando

## Technical Requirements
- Vercel account configurado
- GitHub repository con Actions habilitado
- Environment variables de producción
- Build optimization configurada

## Definition of Done
- [ ] Aplicación desplegada y accesible públicamente
- [ ] Build process funciona sin errores
- [ ] Environment variables funcionan en producción
- [ ] GitHub Actions ejecuta exitosamente en cada push
- [ ] Preview deployments funcionan en PRs
- [ ] Performance básico optimizado (Lighthouse > 80)
- [ ] Logs de deployment visibles y funcionales

## Priority
**Alto** - Validación de stack completo

## Effort Estimate
4 hours

## Dependencies
- ST-001: Development Environment Setup
- ST-002: Project Structure & Initial Configuration
- ST-004: Base App Integration & Wallet Setup

## Notes
- Configurar staging y production environments
- Documentar proceso de deployment
- Configurar alerts para failed deployments
- Verificar que Base App integration funciona en producción
- Setup de monitoring básico