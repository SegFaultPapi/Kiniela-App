# ⚙️ Kiniela App MVP - Sprint 0: Project Setup & Development Environment
## Status Dashboard

**Sprint:** 0 - Project Setup & Development Environment  
**Phase:** Pre-Development (Días 1-4)  
**Status:** 📋 Ready to Start  
**Priority:** P0 (Critical Foundation)

---

## 📊 Progress Overview

| Ticket | Setup Task | Status | Priority | Assignee | Estimate |
|--------|------------|--------|----------|----------|----------|
| [ST-001](./ST-001-environment-setup.md) | Development Environment Setup | 📋 To Do | P0 | - | 4 hours |
| [ST-002](./ST-002-project-structure.md) | Project Structure & Initial Configuration | 📋 To Do | P0 | - | 6 hours |
| [ST-003](./ST-003-smart-contract-setup.md) | Smart Contract Development Setup | 📋 To Do | P0 | - | 5 hours |
| [ST-004](./ST-004-base-app-integration.md) | Base App Integration & Wallet Setup | 📋 To Do | P0 | - | 6 hours |
| [ST-005](./ST-005-database-backend-setup.md) | Database & Backend Setup | 📋 To Do | P1 | - | 5 hours |
| [ST-006](./ST-006-deployment-pipeline.md) | First Deployment & CI/CD Pipeline | 📋 To Do | P1 | - | 4 hours |

**Total Estimate:** 30 hours (4 días)  
**Target Completion:** Before Sprint 1 starts

---

## 🎯 Sprint Success Criteria

- [ ] Entorno de desarrollo local completamente funcional
- [ ] Aplicación Next.js con TypeScript y Tailwind ejecutándose
- [ ] Smart contract environment configurado con Hardhat
- [ ] Base App wallet connection funcionando
- [ ] Base de datos Supabase conectada y esquemas creados
- [ ] Pipeline de CI/CD funcionando con primer deployment
- [ ] Toda la stack technical validada end-to-end

---

## 📋 Definition of Ready

Para que un setup task esté listo para ejecución:
- [ ] Herramientas y dependencies identificadas
- [ ] Configuraciones específicas documentadas
- [ ] Credenciales/accounts necesarios disponibles
- [ ] Documentación de referencia accesible
- [ ] Prerequisites completados

## ✅ Definition of Done

Para considerar un setup task completado:
- [ ] Todos los acceptance criteria cumplidos
- [ ] Configuración documentada en README
- [ ] Scripts de setup automatizados (donde sea posible)
- [ ] Environment variables configuradas
- [ ] Verificación manual ejecutada exitosamente
- [ ] Issues conocidos documentados con soluciones
- [ ] Next steps claramente definidos

---

## 🔗 Dependencies & Execution Order

### Critical Path (Secuencial)
1. **ST-001** → **ST-002** → **ST-003**
2. **ST-004** (requiere ST-001, ST-002)
3. **ST-005** (requiere ST-001, ST-002)
4. **ST-006** (requiere ST-001, ST-002, ST-004)

### Parallel Execution Possible
- ST-004, ST-005 pueden ejecutarse en paralelo después de ST-002
- ST-006 puede empezar cuando ST-004 esté completo

---

## 📝 Technical Stack Validation

### Frontend Stack
- [x] Node.js 18+
- [ ] Next.js 14 with App Router
- [ ] TypeScript 5.0+
- [ ] Tailwind CSS 3.3+
- [ ] shadcn/ui components

### Blockchain Stack
- [ ] Hardhat 2.17+
- [ ] Solidity 0.8.19
- [ ] Base Sepolia testnet
- [ ] Wagmi 2.0+ & Viem 2.0+
- [ ] Base App integration

### Backend Stack
- [ ] Supabase PostgreSQL
- [ ] tRPC 10.0+
- [ ] Next.js API routes
- [ ] Row Level Security

### DevOps Stack
- [ ] Vercel hosting
- [ ] GitHub Actions CI/CD
- [ ] Environment management
- [ ] Monitoring básico

---

## 🚨 Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Base App integration complexity | High | Medium | Seguir docs oficiales, tener WalletConnect fallback |
| Hardhat configuration issues | Medium | Medium | Usar templates oficiales de Base |
| Environment variables conflicts | Medium | High | Documentar claramente, usar .env.example |
| Deployment configuration | High | Low | Test early, documentar proceso |
| Tool version incompatibilities | Medium | Medium | Pin exact versions, documentar requirements |

---

## 🔧 Prerequisites

### Required Accounts & Services
- [ ] GitHub account con repo creado
- [ ] Vercel account para hosting
- [ ] Supabase account para database
- [ ] Base Sepolia testnet ETH (wallet funding)
- [ ] WalletConnect project ID

### Required Local Tools
- [ ] Node.js 18+ installed
- [ ] pnpm package manager
- [ ] Git configured
- [ ] VS Code with extensions
- [ ] Base App o compatible wallet

---

## 📚 Key Resources

- [Base Official Documentation](https://docs.base.org)
- [Base Mini Kit Repository](https://github.com/coinbase/base-mini-kit)
- [Hardhat Base Configuration](https://hardhat.org)
- [Next.js 14 Documentation](https://nextjs.org/docs)
- [Supabase Setup Guide](https://supabase.com/docs)

---

**Last Updated:** October 13, 2025  
**Sprint Lead:** -  
**Next Review:** Before Sprint 1 kickoff