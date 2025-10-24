# Database & Backend Setup (ST-005)

## Configuración Completa

### 1. Supabase Setup
1. Crear proyecto en [supabase.com](https://supabase.com)
2. Obtener URL y keys del proyecto
3. Actualizar variables en `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=tu_url_de_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
   SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
   ```

### 2. Base de Datos
1. Ir al SQL Editor en Supabase
2. Ejecutar el script `database/schema.sql`
3. Verificar que las tablas se crearon correctamente

### 3. Estructura Creada
- ✅ `lib/supabase.ts` - Cliente de Supabase
- ✅ `lib/types.ts` - Tipos TypeScript
- ✅ `lib/trpc.ts` - Router tRPC
- ✅ `lib/trpc-client.ts` - Cliente tRPC
- ✅ `app/api/trpc/[trpc]/route.ts` - API endpoint
- ✅ `database/schema.sql` - Esquemas SQL

### 4. Testing
Para probar la configuración:
1. Iniciar el servidor: `npm run dev`
2. Visitar: `http://localhost:3000/api/trpc/hello?input={"name":"Kiniela"}`

### 5. Scripts de Backup y Restore
Los scripts de backup están ubicados en `database/scripts/`:

- `kiniela-backup.sh` - Script maestro con menú interactivo
- `backup-full.sh` - Backup completo de la base de datos
- `backup-incremental.sh` - Backup incremental de cambios
- `restore.sh` - Restore desde archivos de backup
- `utils.sh` - Utilidades y funciones auxiliares
- `config.sh` - Configuración centralizada

**Configuración rápida:**
```bash
# 1. Configurar contraseña de la base de datos
export SUPABASE_DB_PASSWORD="tu_password"

# 2. Ejecutar script maestro
./database/scripts/kiniela-backup.sh

# 3. O ejecutar backup directo
./database/scripts/backup-full.sh
```

**Documentación completa:** Ver `database/scripts/README.md`

### 6. Próximos Pasos
- Integrar tRPC con Supabase
- Crear queries/mutations reales
- Implementar autenticación
- Agregar más validaciones

