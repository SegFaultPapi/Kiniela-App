#!/bin/bash
# restore.sh - Script de restore para Kiniela App
# Versión mejorada con validaciones y opciones de seguridad

set -e  # Salir si cualquier comando falla

# Configuración
PROJECT_URL="https://icmoifjssawaymkqkxvn.supabase.co"
PROJECT_REF="icmoifjssawaymkqkxvn"
BACKUP_DIR="./backups"
LOG_FILE="$BACKUP_DIR/restore_$(date +%Y%m%d_%H%M%S).log"

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

# Mostrar ayuda
show_help() {
    echo "Uso: $0 [OPCIONES] ARCHIVO_BACKUP"
    echo ""
    echo "Opciones:"
    echo "  -h, --help              Mostrar esta ayuda"
    echo "  -f, --force             Forzar restore sin confirmación"
    echo "  -s, --schema-only       Restaurar solo esquemas"
    echo "  -d, --data-only        Restaurar solo datos"
    echo "  -c, --clean            Limpiar base de datos antes del restore"
    echo "  -t, --target URL       URL de base de datos destino"
    echo "  --dry-run              Simular restore sin ejecutar"
    echo ""
    echo "Ejemplos:"
    echo "  $0 kiniela_backup_20241201_120000.dump"
    echo "  $0 --schema-only kiniela_schema_20241201_120000.sql"
    echo "  $0 --clean --force kiniela_backup_20241201_120000.dump"
    echo ""
    echo "Variables de entorno requeridas:"
    echo "  SUPABASE_DB_PASSWORD    Contraseña de la base de datos"
    echo ""
}

# Verificar dependencias
check_dependencies() {
    log "Verificando dependencias..."
    
    if ! command -v pg_restore &> /dev/null; then
        error "pg_restore no está instalado. Instala PostgreSQL client tools."
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

# Verificar archivo de backup
verify_backup_file() {
    local backup_file="$1"
    
    log "Verificando archivo de backup: $backup_file"
    
    if [ ! -f "$backup_file" ]; then
        error "Archivo de backup no encontrado: $backup_file"
    fi
    
    if [ ! -s "$backup_file" ]; then
        error "El archivo de backup está vacío"
    fi
    
    # Verificar que sea un archivo válido
    if [[ "$backup_file" == *.dump ]]; then
        if ! pg_restore --list "$backup_file" > /dev/null 2>&1; then
            error "El archivo de backup no es un dump válido de PostgreSQL"
        fi
    elif [[ "$backup_file" == *.sql ]]; then
        if ! head -n 1 "$backup_file" | grep -q "PostgreSQL database dump"; then
            warning "El archivo SQL puede no ser un dump válido de PostgreSQL"
        fi
    else
        error "Formato de archivo no soportado. Usa .dump o .sql"
    fi
    
    success "Archivo de backup verificado"
}

# Mostrar información del backup
show_backup_info() {
    local backup_file="$1"
    
    log "Información del backup:"
    echo "=================================="
    echo "📄 Archivo: $backup_file"
    echo "💾 Tamaño: $(du -h "$backup_file" | cut -f1)"
    echo "📅 Modificado: $(stat -c %y "$backup_file")"
    
    if [[ "$backup_file" == *.dump ]]; then
        echo "📋 Contenido:"
        pg_restore --list "$backup_file" | head -20
        echo "..."
    fi
    echo "=================================="
}

# Confirmar restore
confirm_restore() {
    local backup_file="$1"
    local target_url="$2"
    
    echo ""
    warning "⚠️  ADVERTENCIA: Esta operación restaurará datos en la base de datos."
    echo "   Archivo: $backup_file"
    echo "   Destino: $target_url"
    echo ""
    echo "   Esto puede sobrescribir datos existentes."
    echo ""
    
    read -p "¿Estás seguro de que quieres continuar? (escribe 'yes' para confirmar): " confirm
    
    if [ "$confirm" != "yes" ]; then
        log "Restore cancelado por el usuario"
        exit 0
    fi
}

# Limpiar base de datos
clean_database() {
    local db_url="$1"
    
    log "Limpiando base de datos..."
    
    # Lista de tablas a limpiar (en orden correcto para evitar problemas de FK)
    local tables=("transactions" "positions" "markets" "users")
    
    for table in "${tables[@]}"; do
        log "Limpiando tabla: $table"
        if psql "$db_url" -c "TRUNCATE TABLE $table CASCADE;" 2>&1 | tee -a "$LOG_FILE"; then
            success "Tabla $table limpiada"
        else
            warning "Error al limpiar tabla $table (puede no existir)"
        fi
    done
    
    success "Base de datos limpiada"
}

# Restaurar desde dump
restore_from_dump() {
    local backup_file="$1"
    local db_url="$2"
    local schema_only="$3"
    local data_only="$4"
    
    log "Iniciando restore desde dump..."
    
    local restore_opts="--verbose --no-owner --no-privileges"
    
    if [ "$schema_only" = true ]; then
        restore_opts="$restore_opts --schema-only"
        log "Modo: Solo esquemas"
    elif [ "$data_only" = true ]; then
        restore_opts="$restore_opts --data-only"
        log "Modo: Solo datos"
    else
        log "Modo: Esquemas y datos completos"
    fi
    
    if pg_restore $restore_opts --dbname="$db_url" "$backup_file" 2>&1 | tee -a "$LOG_FILE"; then
        success "Restore desde dump completado"
        return 0
    else
        error "Error durante el restore desde dump"
    fi
}

# Restaurar desde SQL
restore_from_sql() {
    local backup_file="$1"
    local db_url="$2"
    
    log "Iniciando restore desde SQL..."
    
    if psql "$db_url" -f "$backup_file" 2>&1 | tee -a "$LOG_FILE"; then
        success "Restore desde SQL completado"
        return 0
    else
        error "Error durante el restore desde SQL"
    fi
}

# Verificar restore
verify_restore() {
    local db_url="$1"
    
    log "Verificando restore..."
    
    # Verificar que las tablas existan
    local tables=("users" "markets" "positions" "transactions")
    
    for table in "${tables[@]}"; do
        if psql "$db_url" -c "SELECT COUNT(*) FROM $table;" > /dev/null 2>&1; then
            local count=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM $table;" | tr -d ' ')
            log "Tabla $table: $count registros"
        else
            error "Tabla $table no existe después del restore"
        fi
    done
    
    success "Restore verificado exitosamente"
}

# Función principal
main() {
    local backup_file=""
    local force=false
    local schema_only=false
    local data_only=false
    local clean=false
    local dry_run=false
    local target_url=""
    
    # Parsear argumentos
    while [[ $# -gt 0 ]]; do
        case $1 in
            -h|--help)
                show_help
                exit 0
                ;;
            -f|--force)
                force=true
                shift
                ;;
            -s|--schema-only)
                schema_only=true
                shift
                ;;
            -d|--data-only)
                data_only=true
                shift
                ;;
            -c|--clean)
                clean=true
                shift
                ;;
            --dry-run)
                dry_run=true
                shift
                ;;
            -t|--target)
                target_url="$2"
                shift 2
                ;;
            -*)
                error "Opción desconocida: $1"
                ;;
            *)
                if [ -z "$backup_file" ]; then
                    backup_file="$1"
                else
                    error "Múltiples archivos de backup especificados"
                fi
                shift
                ;;
        esac
    done
    
    # Validar argumentos
    if [ -z "$backup_file" ]; then
        error "Debes especificar un archivo de backup"
    fi
    
    # Configurar URL de destino
    if [ -z "$target_url" ]; then
        target_url="postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"
    fi
    
    echo "🔄 Iniciando restore de Kiniela App..."
    echo "📅 Fecha: $(date)"
    echo "📄 Archivo: $backup_file"
    echo "🎯 Destino: $target_url"
    echo ""
    
    # Verificaciones previas
    check_dependencies
    check_env
    verify_backup_file "$backup_file"
    
    # Mostrar información
    show_backup_info "$backup_file"
    
    # Confirmar si no es forzado
    if [ "$force" = false ] && [ "$dry_run" = false ]; then
        confirm_restore "$backup_file" "$target_url"
    fi
    
    # Modo dry-run
    if [ "$dry_run" = true ]; then
        log "Modo dry-run: No se ejecutará el restore"
        success "Simulación completada"
        exit 0
    fi
    
    # Limpiar si se solicita
    if [ "$clean" = true ]; then
        clean_database "$target_url"
    fi
    
    # Ejecutar restore según el tipo de archivo
    if [[ "$backup_file" == *.dump ]]; then
        restore_from_dump "$backup_file" "$target_url" "$schema_only" "$data_only"
    elif [[ "$backup_file" == *.sql ]]; then
        restore_from_sql "$backup_file" "$target_url"
    fi
    
    # Verificar restore
    verify_restore "$target_url"
    
    success "Restore completado exitosamente!"
}

# Manejo de señales
trap 'error "Restore interrumpido por el usuario"' INT TERM

# Ejecutar función principal
main "$@"
