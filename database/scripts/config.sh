#!/bin/bash
# config.sh - Configuración para scripts de backup/restore de Kiniela App

# ==============================================
# CONFIGURACIÓN DE PROYECTO SUPABASE
# ==============================================

# URL del proyecto Supabase
export SUPABASE_PROJECT_URL="https://icmoifjssawaymkqkxvn.supabase.co"

# Referencia del proyecto (usado en URLs de conexión)
export SUPABASE_PROJECT_REF="icmoifjssawaymkqkxvn"

# ==============================================
# CONFIGURACIÓN DE BACKUP
# ==============================================

# Directorio donde se almacenan los backups
export BACKUP_DIR="./backups"

# Días de retención para backups completos
export BACKUP_RETENTION_DAYS=7

# Días de retención para backups incrementales
export INCREMENTAL_RETENTION_DAYS=3

# Días de retención para logs
export LOG_RETENTION_DAYS=14

# ==============================================
# CONFIGURACIÓN DE BASE DE DATOS
# ==============================================

# Puerto de PostgreSQL (por defecto)
export DB_PORT=5432

# Nombre de la base de datos
export DB_NAME="postgres"

# Usuario de la base de datos
export DB_USER="postgres"

# ==============================================
# CONFIGURACIÓN DE NOTIFICACIONES
# ==============================================

# Email para notificaciones (opcional)
# export NOTIFICATION_EMAIL="admin@kiniela.app"

# Webhook para notificaciones (opcional)
# export NOTIFICATION_WEBHOOK="https://hooks.slack.com/services/..."

# ==============================================
# CONFIGURACIÓN DE COMPRESIÓN
# ==============================================

# Nivel de compresión para pg_dump (0-9, donde 9 es máxima compresión)
export COMPRESSION_LEVEL=9

# Usar compresión paralela (requiere pg_dump con soporte)
export PARALLEL_COMPRESSION=false

# ==============================================
# CONFIGURACIÓN DE SEGURIDAD
# ==============================================

# Permisos para archivos de backup
export BACKUP_FILE_PERMISSIONS=600

# Permisos para directorios de backup
export BACKUP_DIR_PERMISSIONS=700

# ==============================================
# CONFIGURACIÓN DE LOGGING
# ==============================================

# Nivel de logging (DEBUG, INFO, WARN, ERROR)
export LOG_LEVEL="INFO"

# Incluir timestamps en logs
export LOG_TIMESTAMPS=true

# Rotar logs automáticamente
export LOG_ROTATION=true

# ==============================================
# CONFIGURACIÓN DE VALIDACIÓN
# ==============================================

# Verificar integridad de backups automáticamente
export VERIFY_BACKUPS=true

# Ejecutar tests de restore automáticamente
export TEST_RESTORE=false

# ==============================================
# CONFIGURACIÓN DE PERFORMANCE
# ==============================================

# Número de conexiones paralelas para backup
export PARALLEL_JOBS=1

# Tamaño de buffer para operaciones de I/O
export IO_BUFFER_SIZE="64MB"

# Timeout para operaciones de conexión (segundos)
export CONNECTION_TIMEOUT=30

# ==============================================
# FUNCIONES DE UTILIDAD
# ==============================================

# Función para obtener URL de conexión completa
get_db_url() {
    if [ -z "$SUPABASE_DB_PASSWORD" ]; then
        echo "Error: SUPABASE_DB_PASSWORD no está configurada" >&2
        return 1
    fi
    
    echo "postgresql://$DB_USER:$SUPABASE_DB_PASSWORD@db.$SUPABASE_PROJECT_REF.supabase.co:$DB_PORT/$DB_NAME"
}

# Función para verificar configuración
check_config() {
    local errors=0
    
    # Verificar variables requeridas
    if [ -z "$SUPABASE_DB_PASSWORD" ]; then
        echo "Error: SUPABASE_DB_PASSWORD no está configurada" >&2
        ((errors++))
    fi
    
    if [ -z "$BACKUP_DIR" ]; then
        echo "Error: BACKUP_DIR no está configurada" >&2
        ((errors++))
    fi
    
    # Verificar que el directorio de backup exista
    if [ ! -d "$BACKUP_DIR" ]; then
        echo "Creando directorio de backup: $BACKUP_DIR"
        mkdir -p "$BACKUP_DIR"
        chmod "$BACKUP_DIR_PERMISSIONS" "$BACKUP_DIR"
    fi
    
    # Verificar permisos del directorio
    if [ ! -w "$BACKUP_DIR" ]; then
        echo "Error: No se puede escribir en el directorio de backup: $BACKUP_DIR" >&2
        ((errors++))
    fi
    
    return $errors
}

# Función para mostrar configuración actual
show_config() {
    echo "=================================="
    echo "CONFIGURACIÓN DE BACKUP KINIELA"
    echo "=================================="
    echo "Proyecto Supabase: $SUPABASE_PROJECT_URL"
    echo "Referencia: $SUPABASE_PROJECT_REF"
    echo "Directorio de backup: $BACKUP_DIR"
    echo "Retención (días): $BACKUP_RETENTION_DAYS"
    echo "Compresión: Nivel $COMPRESSION_LEVEL"
    echo "Verificación: $VERIFY_BACKUPS"
    echo "=================================="
}

# ==============================================
# INICIALIZACIÓN
# ==============================================

# Verificar configuración al cargar el archivo
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    # Si se ejecuta directamente, mostrar configuración
    show_config
    check_config
    exit $?
fi
