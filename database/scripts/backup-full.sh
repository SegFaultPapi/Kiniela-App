#!/bin/bash
# backup-full.sh - Script de backup completo para Kiniela App
# Versión mejorada con validaciones y opciones avanzadas

set -e  # Salir si cualquier comando falla

# Configuración
PROJECT_URL="https://icmoifjssawaymkqkxvn.supabase.co"
PROJECT_REF="icmoifjssawaymkqkxvn"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="kiniela_backup_$DATE.dump"
LOG_FILE="$BACKUP_DIR/backup_$DATE.log"

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Función para logging
log() {
    echo -e "${BLUE}[$(date '+%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
    exit 1
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    if ! command -v pg_dump &> /dev/null; then
        error "pg_dump no está instalado. Instala PostgreSQL client tools."
    fi
    
    if ! command -v psql &> /dev/null; then
        error "psql no está instalado. Instala PostgreSQL client tools."
    fi
    
    success "Dependencias verificadas"
}

# Verificar variables de entorno
check_env() {
    log "Verificando variables de entorno..."
    
    if [ -z "$SUPABASE_DB_PASSWORD" ]; then
        error "SUPABASE_DB_PASSWORD no está configurada. Configúrala con: export SUPABASE_DB_PASSWORD='tu_password'"
    fi
    
    success "Variables de entorno verificadas"
}

# Crear directorio de backup
setup_backup_dir() {
    log "Configurando directorio de backup..."
    
    mkdir -p "$BACKUP_DIR"
    
    if [ ! -d "$BACKUP_DIR" ]; then
        error "No se pudo crear el directorio de backup: $BACKUP_DIR"
    fi
    
    success "Directorio de backup configurado: $BACKUP_DIR"
}

# Backup de la base de datos
backup_database() {
    log "Iniciando backup de la base de datos..."
    
    local db_url="postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"
    local backup_path="$BACKUP_DIR/$BACKUP_FILE"
    
    log "URL de conexión: postgresql://postgres:***@db.$PROJECT_REF.supabase.co:5432/postgres"
    log "Archivo de backup: $backup_path"
    
    # Ejecutar pg_dump con opciones optimizadas
    if pg_dump "$db_url" \
        --format=custom \
        --compress=9 \
        --verbose \
        --no-owner \
        --no-privileges \
        --file="$backup_path" 2>&1 | tee -a "$LOG_FILE"; then
        
        success "Backup de base de datos completado: $backup_path"
        
        # Verificar tamaño del archivo
        local file_size=$(du -h "$backup_path" | cut -f1)
        log "Tamaño del archivo de backup: $file_size"
        
        return 0
    else
        error "Error durante el backup de la base de datos"
    fi
}

# Backup de esquemas solamente
backup_schema_only() {
    log "Creando backup de esquemas solamente..."
    
    local db_url="postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"
    local schema_backup="$BACKUP_DIR/kiniela_schema_$DATE.sql"
    
    if pg_dump "$db_url" \
        --schema-only \
        --no-owner \
        --no-privileges \
        --file="$schema_backup" 2>&1 | tee -a "$LOG_FILE"; then
        
        success "Backup de esquemas completado: $schema_backup"
        return 0
    else
        error "Error durante el backup de esquemas"
    fi
}

# Backup de datos solamente
backup_data_only() {
    log "Creando backup de datos solamente..."
    
    local db_url="postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"
    local data_backup="$BACKUP_DIR/kiniela_data_$DATE.sql"
    
    if pg_dump "$db_url" \
        --data-only \
        --no-owner \
        --no-privileges \
        --file="$data_backup" 2>&1 | tee -a "$LOG_FILE"; then
        
        success "Backup de datos completado: $data_backup"
        return 0
    else
        error "Error durante el backup de datos"
    fi
}

# Verificar integridad del backup
verify_backup() {
    log "Verificando integridad del backup..."
    
    local backup_path="$BACKUP_DIR/$BACKUP_FILE"
    
    if [ ! -f "$backup_path" ]; then
        error "Archivo de backup no encontrado: $backup_path"
    fi
    
    # Verificar que el archivo no esté vacío
    if [ ! -s "$backup_path" ]; then
        error "El archivo de backup está vacío"
    fi
    
    # Verificar que sea un archivo válido de pg_dump
    if ! pg_restore --list "$backup_path" > /dev/null 2>&1; then
        error "El archivo de backup no es válido"
    fi
    
    success "Integridad del backup verificada"
}

# Limpiar backups antiguos
cleanup_old_backups() {
    log "Limpiando backups antiguos..."
    
    local retention_days=${BACKUP_RETENTION_DAYS:-7}
    
    if [ "$retention_days" -gt 0 ]; then
        find "$BACKUP_DIR" -name "kiniela_backup_*.dump" -type f -mtime +$retention_days -delete
        find "$BACKUP_DIR" -name "kiniela_schema_*.sql" -type f -mtime +$retention_days -delete
        find "$BACKUP_DIR" -name "kiniela_data_*.sql" -type f -mtime +$retention_days -delete
        find "$BACKUP_DIR" -name "backup_*.log" -type f -mtime +$retention_days -delete
        
        log "Backups más antiguos que $retention_days días han sido eliminados"
    fi
}

# Mostrar información del backup
show_backup_info() {
    log "Información del backup completado:"
    echo "=================================="
    echo "📅 Fecha: $(date)"
    echo "📁 Directorio: $BACKUP_DIR"
    echo "📄 Archivo principal: $BACKUP_FILE"
    echo "📋 Log: $LOG_FILE"
    echo "💾 Tamaño: $(du -h "$BACKUP_DIR/$BACKUP_FILE" | cut -f1)"
    echo "=================================="
}

# Función principal
main() {
    echo "🔄 Iniciando backup completo de Kiniela App..."
    echo "📅 Fecha: $(date)"
    echo "📁 Directorio: $BACKUP_DIR"
    echo ""
    
    # Verificaciones previas
    check_dependencies
    check_env
    setup_backup_dir
    
    # Ejecutar backup según el tipo especificado
    case "${1:-full}" in
        "full")
            backup_database
            ;;
        "schema")
            backup_schema_only
            ;;
        "data")
            backup_data_only
            ;;
        *)
            error "Tipo de backup inválido. Usa: full, schema, o data"
            ;;
    esac
    
    # Verificaciones posteriores
    if [ "${1:-full}" = "full" ]; then
        verify_backup
    fi
    
    # Limpieza
    cleanup_old_backups
    
    # Información final
    show_backup_info
    
    success "Backup completado exitosamente!"
}

# Manejo de señales
trap 'error "Backup interrumpido por el usuario"' INT TERM

# Ejecutar función principal
main "$@"