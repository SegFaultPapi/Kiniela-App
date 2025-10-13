# ST-005: Database & Backend Setup

## Epic
Sprint 0: Project Setup & Development Environment

## Story
**Como desarrollador backend**
Quiero configurar la base de datos y API backend para la aplicación
**Para poder** almacenar datos de markets, usuarios y transacciones

## Description
Configuración de Supabase PostgreSQL como base de datos principal, creación de esquemas iniciales, configuración de tRPC para type-safe APIs, y setup de indexing para eventos de smart contracts.

## Acceptance Criteria
- [ ] Proyecto Supabase creado y configurado
- [ ] Esquemas de base de datos creados:
  - `markets` table
  - `users` table  
  - `positions` table
  - `transactions` table
- [ ] tRPC router configurado
- [ ] Conexión a Supabase desde Next.js funcionando
- [ ] Variables de entorno de DB configuradas
- [ ] Scripts de migración creados
- [ ] Row Level Security (RLS) básico configurado

## Technical Requirements
- Supabase PostgreSQL
- tRPC 10.0.0 o superior
- Prisma como ORM (opcional)
- Next.js API routes configuradas
- Environment variables configuradas

## Definition of Done
- [ ] Conexión a Supabase exitosa desde aplicación
- [ ] tRPC queries/mutations funcionan correctamente
- [ ] Tables creadas con esquemas apropiados
- [ ] CRUD operations básicas funcionan
- [ ] Environment variables configuradas en .env.local
- [ ] Backup y restore scripts documentados
- [ ] RLS policies básicas implementadas

## Priority
**Alto** - Necesario para Sprint 1

## Effort Estimate
5 hours

## Dependencies
- ST-001: Development Environment Setup
- ST-002: Project Structure & Initial Configuration

## Notes
- Usar Supabase free tier inicialmente
- Configurar indexes apropiados desde inicio
- Documentar esquema de DB
- Considerar data types apropiados para blockchain data
- Setup de conexión pooling si es necesario