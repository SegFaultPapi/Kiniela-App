# Scripts de Backup y Restore - Kiniela App

Esta documentación describe los scripts de backup y restore para la aplicación Kiniela, diseñados para trabajar con Supabase PostgreSQL.

## 📋 Índice

- [Scripts Disponibles](#scripts-disponibles)
- [Configuración Inicial](#configuración-inicial)
- [Script de Backup Completo](#script-de-backup-completo)
- [Script de Backup Incremental](#script-de-backup-incremental)
- [Script de Restore](#script-de-restore)
- [Ejemplos de Uso](#ejemplos-de-uso)
- [Automatización](#automatización)
- [Solución de Problemas](#solución-de-problemas)
- [Mejores Prácticas](#mejores-prácticas)

## 🛠️ Scripts Disponibles

### 1. `backup-full.sh`
Script principal para backup completo de la base de datos.

**Características:**
- Backup completo con formato custom de PostgreSQL
- Compresión optimizada
- Verificación de integridad
- Limpieza automática de backups antiguos
- Logging detallado

### 2. `backup-incremental.sh`
Script para backup incremental de datos modificados.

**Características:**
- Backup solo de datos modificados desde el último backup
- Genera archivos SQL con INSERT/UPDATE
- Estadísticas de cambios
- Optimizado para bases de datos grandes

### 3. `restore.sh`
Script para restaurar backups en la base de datos.

**Características:**
- Soporte para archivos .dump y .sql
- Opciones de restore parcial (solo esquemas o datos)
- Verificación de integridad
- Modo dry-run para pruebas

## ⚙️ Configuración Inicial

### 1. Instalar Dependencias

```bash
# Ubuntu/Debian
sudo apt-get install postgresql-client

# macOS
brew install postgresql

# Verificar instalación
pg_dump --version
psql --version
```

### 2. Configurar Variables de Entorno

```bash
# Configurar contraseña de la base de datos
export SUPABASE_DB_PASSWORD="tu_password_aqui"

# Opcional: Configurar retención de backups (días)
export BACKUP_RETENTION_DAYS=7
```

### 3. Crear Directorio de Backups

```bash
mkdir -p ./backups
chmod 755 ./backups
```

## 📦 Script de Backup Completo

### Uso Básico

```bash
# Backup completo
./backup-full.sh

# Backup solo de esquemas
./backup-full.sh schema

# Backup solo de datos
./backup-full.sh data
```

### Características Avanzadas

El script incluye:

- **Verificación de dependencias**: Comprueba que `pg_dump` y `psql` estén instalados
- **Validación de entorno**: Verifica variables de entorno requeridas
- **Compresión optimizada**: Usa compresión nivel 9 para minimizar tamaño
- **Verificación de integridad**: Valida que el backup sea restaurable
- **Limpieza automática**: Elimina backups antiguos según configuración
- **Logging detallado**: Registra todas las operaciones en archivos de log

### Estructura de Archivos Generados

```
backups/
├── kiniela_backup_20241201_120000.dump    # Backup completo
├── kiniela_schema_20241201_120000.sql     # Solo esquemas
├── kiniela_data_20241201_120000.sql       # Solo datos
└── backup_20241201_120000.log             # Log de operación
```

## 🔄 Script de Backup Incremental

### Uso

```bash
# Backup incremental automático
./backup-incremental.sh
```

### Funcionamiento

1. **Detecta último backup**: Busca el archivo de backup más reciente
2. **Calcula timestamp**: Usa la fecha de modificación del último backup
3. **Genera SQL incremental**: Crea archivos SQL con INSERT/UPDATE
4. **Estadísticas**: Muestra cantidad de cambios por tabla

### Archivo Generado

```sql
-- Backup incremental de Kiniela App
-- Fecha: 2024-12-01 12:00:00
-- Desde: 2024-11-30 12:00:00

BEGIN;

-- Usuarios modificados
INSERT INTO users (...) VALUES (...)
ON CONFLICT (id) DO UPDATE SET ...;

-- Mercados modificados
INSERT INTO markets (...) VALUES (...)
ON CONFLICT (id) DO UPDATE SET ...;

COMMIT;
```

## 🔧 Script de Restore

### Uso Básico

```bash
# Restore completo
./restore.sh kiniela_backup_20241201_120000.dump

# Restore solo esquemas
./restore.sh --schema-only kiniela_schema_20241201_120000.sql

# Restore solo datos
./restore.sh --data-only kiniela_data_20241201_120000.sql
```

### Opciones Avanzadas

```bash
# Restore con limpieza previa
./restore.sh --clean kiniela_backup_20241201_120000.dump

# Restore forzado (sin confirmación)
./restore.sh --force kiniela_backup_20241201_120000.dump

# Simulación (dry-run)
./restore.sh --dry-run kiniela_backup_20241201_120000.dump

# Restore a base de datos específica
./restore.sh --target "postgresql://user:pass@host:port/db" backup.dump
```

### Proceso de Restore

1. **Verificación**: Valida archivo de backup y dependencias
2. **Confirmación**: Solicita confirmación del usuario (a menos que use --force)
3. **Limpieza**: Opcionalmente limpia la base de datos
4. **Restore**: Ejecuta pg_restore o psql según el tipo de archivo
5. **Verificación**: Comprueba que las tablas existan y tengan datos

## 📝 Ejemplos de Uso

### Flujo de Trabajo Diario

```bash
# 1. Backup completo semanal
./backup-full.sh

# 2. Backups incrementales diarios
./backup-incremental.sh

# 3. Verificar backups
ls -la backups/
```

### Restore de Emergencia

```bash
# 1. Identificar backup más reciente
ls -la backups/kiniela_backup_*.dump

# 2. Restore completo con limpieza
./restore.sh --clean --force kiniela_backup_20241201_120000.dump

# 3. Verificar restore
psql "postgresql://postgres:$SUPABASE_DB_PASSWORD@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres" -c "SELECT COUNT(*) FROM users;"
```

### Migración de Datos

```bash
# 1. Backup de origen
./backup-full.sh

# 2. Restore en destino
./restore.sh --target "postgresql://user:pass@destino:5432/db" kiniela_backup_20241201_120000.dump

# 3. Verificar migración
./restore.sh --dry-run kiniela_backup_20241201_120000.dump
```

## 🤖 Automatización

### Cron Jobs

```bash
# Editar crontab
crontab -e

# Backup completo semanal (domingos a las 2 AM)
0 2 * * 0 cd /path/to/kiniela && ./backup-full.sh

# Backup incremental diario (todos los días a las 3 AM)
0 3 * * 1-6 cd /path/to/kiniela && ./backup-incremental.sh

# Limpieza mensual (primer día del mes a las 4 AM)
0 4 1 * * cd /path/to/kiniela && find backups/ -name "*.dump" -mtime +30 -delete
```

### Script de Automatización

```bash
#!/bin/bash
# auto-backup.sh - Script de automatización

set -e

# Configuración
BACKUP_DIR="./backups"
LOG_FILE="$BACKUP_DIR/auto-backup.log"

# Función de logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" >> "$LOG_FILE"
}

# Backup completo semanal
if [ "$(date +%u)" = "7" ]; then
    log "Iniciando backup completo semanal"
    ./backup-full.sh
    log "Backup completo completado"
else
    log "Iniciando backup incremental diario"
    ./backup-incremental.sh
    log "Backup incremental completado"
fi

# Verificar espacio en disco
DISK_USAGE=$(df -h "$BACKUP_DIR" | awk 'NR==2 {print $5}' | sed 's/%//')
if [ "$DISK_USAGE" -gt 80 ]; then
    log "ADVERTENCIA: Uso de disco alto ($DISK_USAGE%)"
fi

log "Proceso de backup automatizado completado"
```

## 🔍 Solución de Problemas

### Errores Comunes

#### 1. Error de Conexión

```
Error: connection to server at "db.icmoifjssawaymkqkxvn.supabase.co", port 5432 failed
```

**Solución:**
- Verificar que `SUPABASE_DB_PASSWORD` esté configurada
- Comprobar conectividad de red
- Verificar que la URL del proyecto sea correcta

#### 2. Error de Permisos

```
Error: permission denied for table users
```

**Solución:**
- Verificar que el usuario tenga permisos de lectura/escritura
- Comprobar políticas RLS en Supabase
- Usar SERVICE_ROLE_KEY para operaciones administrativas

#### 3. Error de Espacio en Disco

```
Error: No space left on device
```

**Solución:**
- Limpiar backups antiguos: `find backups/ -mtime +7 -delete`
- Aumentar espacio en disco
- Configurar retención más corta: `export BACKUP_RETENTION_DAYS=3`

#### 4. Error de Integridad

```
Error: The file of backup is not valid
```

**Solución:**
- Verificar que el archivo no esté corrupto
- Comprobar que sea un dump válido de PostgreSQL
- Regenerar backup si es necesario

### Logs y Debugging

```bash
# Ver logs de backup
tail -f backups/backup_*.log

# Ver logs de restore
tail -f backups/restore_*.log

# Verificar conectividad
psql "postgresql://postgres:$SUPABASE_DB_PASSWORD@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres" -c "SELECT version();"
```

## 📚 Mejores Prácticas

### 1. Estrategia de Backup

- **Backup completo semanal**: Para recuperación completa
- **Backup incremental diario**: Para cambios recientes
- **Retención de 30 días**: Para backups completos
- **Retención de 7 días**: Para backups incrementales

### 2. Seguridad

- **Nunca hardcodear contraseñas** en scripts
- **Usar variables de entorno** para credenciales
- **Restringir permisos** de archivos de backup
- **Encriptar backups sensibles** si es necesario

### 3. Monitoreo

- **Verificar backups regularmente** con restore de prueba
- **Monitorear espacio en disco** disponible
- **Alertas automáticas** para fallos de backup
- **Logs centralizados** para auditoría

### 4. Testing

- **Probar restore regularmente** en entorno de desarrollo
- **Validar integridad** de backups generados
- **Simular desastres** para verificar procedimientos
- **Documentar procedimientos** de recuperación

### 5. Optimización

- **Usar compresión** para reducir tamaño de archivos
- **Paralelizar backups** para bases de datos grandes
- **Excluir datos innecesarios** del backup
- **Usar streaming** para backups muy grandes

## 📞 Soporte

Para problemas o preguntas sobre los scripts de backup:

1. **Revisar logs** en el directorio `backups/`
2. **Verificar configuración** de variables de entorno
3. **Consultar documentación** de PostgreSQL
4. **Contactar al equipo** de desarrollo

---

**Nota**: Estos scripts están diseñados específicamente para Kiniela App con Supabase. Para otros proyectos, puede ser necesario ajustar las configuraciones y políticas RLS.
