#!/bin/bash
# utils.sh - Utilidades para scripts de backup/restore de Kiniela App

set -e

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Función para logging con colores
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    case "$level" in
        "INFO")
            echo -e "${BLUE}[$timestamp] [INFO]${NC} $message"
            ;;
        "SUCCESS")
            echo -e "${GREEN}[$timestamp] [SUCCESS]${NC} $message"
            ;;
        "WARNING")
            echo -e "${YELLOW}[$timestamp] [WARNING]${NC} $message"
            ;;
        "ERROR")
            echo -e "${RED}[$timestamp] [ERROR]${NC} $message"
            ;;
        "DEBUG")
            echo -e "${PURPLE}[$timestamp] [DEBUG]${NC} $message"
            ;;
        *)
            echo -e "${CYAN}[$timestamp] [$level]${NC} $message"
            ;;
    esac
}

# Función para mostrar progreso
show_progress() {
    local current="$1"
    local total="$2"
    local description="$3"
    
    local percentage=$((current * 100 / total))
    local filled=$((percentage / 2))
    local empty=$((50 - filled))
    
    printf "\r${BLUE}[%3d%%]${NC} %s [" "$percentage" "$description"
    printf "%*s" "$filled" | tr ' ' '='
    printf "%*s" "$empty" | tr ' ' ' '
    printf "] %d/%d" "$current" "$total"
}

# Función para verificar dependencias
check_dependencies() {
    log "INFO" "Verificando dependencias..."
    
    local deps=("pg_dump" "psql" "pg_restore")
    local missing=()
    
    for dep in "${deps[@]}"; do
        if ! command -v "$dep" &> /dev/null; then
            missing+=("$dep")
        fi
    done
    
    if [ ${#missing[@]} -gt 0 ]; then
        log "ERROR" "Dependencias faltantes: ${missing[*]}"
        log "INFO" "Instala PostgreSQL client tools:"
        log "INFO" "  Ubuntu/Debian: sudo apt-get install postgresql-client"
        log "INFO" "  macOS: brew install postgresql"
        return 1
    fi
    
    log "SUCCESS" "Todas las dependencias están instaladas"
    return 0
}

# Función para verificar conectividad
check_connectivity() {
    local db_url="$1"
    local timeout="${2:-10}"
    
    log "INFO" "Verificando conectividad a la base de datos..."
    
    if timeout "$timeout" psql "$db_url" -c "SELECT 1;" > /dev/null 2>&1; then
        log "SUCCESS" "Conexión a la base de datos exitosa"
        return 0
    else
        log "ERROR" "No se puede conectar a la base de datos"
        log "INFO" "Verifica:"
        log "INFO" "  - SUPABASE_DB_PASSWORD está configurada"
        log "INFO" "  - La URL del proyecto es correcta"
        log "INFO" "  - La conectividad de red"
        return 1
    fi
}

# Función para obtener estadísticas de la base de datos
get_db_stats() {
    local db_url="$1"
    
    log "INFO" "Obteniendo estadísticas de la base de datos..."
    
    echo "=================================="
    echo "ESTADÍSTICAS DE LA BASE DE DATOS"
    echo "=================================="
    
    # Contar registros por tabla
    local tables=("users" "markets" "positions" "transactions")
    
    for table in "${tables[@]}"; do
        local count=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM $table;" 2>/dev/null | tr -d ' ' || echo "N/A")
        echo "📊 $table: $count registros"
    done
    
    # Tamaño de la base de datos
    local db_size=$(psql "$db_url" -t -c "SELECT pg_size_pretty(pg_database_size(current_database()));" 2>/dev/null | tr -d ' ' || echo "N/A")
    echo "💾 Tamaño total: $db_size"
    
    # Última actividad
    local last_activity=$(psql "$db_url" -t -c "SELECT MAX(GREATEST(created_at, updated_at)) FROM (SELECT created_at, updated_at FROM users UNION ALL SELECT created_at, updated_at FROM markets UNION ALL SELECT created_at, created_at as updated_at FROM positions UNION ALL SELECT created_at, created_at as updated_at FROM transactions) t;" 2>/dev/null | tr -d ' ' || echo "N/A")
    echo "🕒 Última actividad: $last_activity"
    
    echo "=================================="
}

# Función para limpiar archivos antiguos
cleanup_old_files() {
    local directory="$1"
    local pattern="$2"
    local retention_days="$3"
    
    if [ -z "$retention_days" ] || [ "$retention_days" -le 0 ]; then
        log "WARNING" "Retención no configurada, saltando limpieza"
        return 0
    fi
    
    log "INFO" "Limpiando archivos antiguos en $directory (patrón: $pattern, retención: $retention_days días)"
    
    local deleted_count=0
    
    while IFS= read -r -d '' file; do
        rm "$file"
        ((deleted_count++))
        log "DEBUG" "Eliminado: $file"
    done < <(find "$directory" -name "$pattern" -type f -mtime +$retention_days -print0 2>/dev/null)
    
    if [ $deleted_count -gt 0 ]; then
        log "SUCCESS" "Eliminados $deleted_count archivos antiguos"
    else
        log "INFO" "No se encontraron archivos antiguos para eliminar"
    fi
}

# Función para verificar espacio en disco
check_disk_space() {
    local directory="$1"
    local threshold="${2:-80}"
    
    local usage=$(df -h "$directory" | awk 'NR==2 {print $5}' | sed 's/%//')
    
    if [ "$usage" -gt "$threshold" ]; then
        log "WARNING" "Uso de disco alto: ${usage}% (umbral: ${threshold}%)"
        log "INFO" "Considera limpiar archivos antiguos o aumentar espacio en disco"
        return 1
    else
        log "INFO" "Uso de disco: ${usage}% (OK)"
        return 0
    fi
}

# Función para validar archivo de backup
validate_backup_file() {
    local backup_file="$1"
    
    log "INFO" "Validando archivo de backup: $backup_file"
    
    # Verificar que el archivo exista
    if [ ! -f "$backup_file" ]; then
        log "ERROR" "Archivo de backup no encontrado: $backup_file"
        return 1
    fi
    
    # Verificar que no esté vacío
    if [ ! -s "$backup_file" ]; then
        log "ERROR" "El archivo de backup está vacío"
        return 1
    fi
    
    # Verificar tipo de archivo
    if [[ "$backup_file" == *.dump ]]; then
        # Verificar que sea un dump válido
        if ! pg_restore --list "$backup_file" > /dev/null 2>&1; then
            log "ERROR" "El archivo no es un dump válido de PostgreSQL"
            return 1
        fi
        log "SUCCESS" "Archivo de dump válido"
        
    elif [[ "$backup_file" == *.sql ]]; then
        # Verificar sintaxis SQL básica
        if ! head -n 1 "$backup_file" | grep -q "PostgreSQL\|--\|BEGIN"; then
            log "WARNING" "El archivo SQL puede no ser un dump válido de PostgreSQL"
        fi
        log "SUCCESS" "Archivo SQL válido"
        
    else
        log "ERROR" "Formato de archivo no soportado. Usa .dump o .sql"
        return 1
    fi
    
    # Mostrar información del archivo
    local file_size=$(du -h "$backup_file" | cut -f1)
    local file_date=$(stat -c %y "$backup_file" | cut -d'.' -f1)
    
    log "INFO" "Tamaño: $file_size"
    log "INFO" "Modificado: $file_date"
    
    return 0
}

# Función para enviar notificaciones
send_notification() {
    local message="$1"
    local level="${2:-INFO}"
    
    # Notificación por email (si está configurada)
    if [ -n "$NOTIFICATION_EMAIL" ]; then
        echo "$message" | mail -s "[Kiniela Backup] $level" "$NOTIFICATION_EMAIL" 2>/dev/null || true
    fi
    
    # Notificación por webhook (si está configurada)
    if [ -n "$NOTIFICATION_WEBHOOK" ]; then
        local color="good"
        case "$level" in
            "ERROR") color="danger" ;;
            "WARNING") color="warning" ;;
            "SUCCESS") color="good" ;;
        esac
        
        curl -X POST "$NOTIFICATION_WEBHOOK" \
            -H "Content-Type: application/json" \
            -d "{\"text\":\"$message\", \"color\":\"$color\"}" 2>/dev/null || true
    fi
    
    log "$level" "$message"
}

# Función para crear directorio con permisos
create_secure_directory() {
    local directory="$1"
    local permissions="${2:-700}"
    
    if [ ! -d "$directory" ]; then
        mkdir -p "$directory"
        chmod "$permissions" "$directory"
        log "SUCCESS" "Directorio creado: $directory (permisos: $permissions)"
    else
        log "INFO" "Directorio ya existe: $directory"
    fi
}

# Función para generar hash de archivo
get_file_hash() {
    local file="$1"
    local algorithm="${2:-sha256}"
    
    if [ -f "$file" ]; then
        case "$algorithm" in
            "md5") md5sum "$file" | cut -d' ' -f1 ;;
            "sha1") sha1sum "$file" | cut -d' ' -f1 ;;
            "sha256") sha256sum "$file" | cut -d' ' -f1 ;;
            *) log "ERROR" "Algoritmo de hash no soportado: $algorithm" && return 1 ;;
        esac
    else
        log "ERROR" "Archivo no encontrado: $file"
        return 1
    fi
}

# Función para mostrar ayuda
show_help() {
    echo "Utilidades para scripts de backup/restore de Kiniela App"
    echo ""
    echo "Uso: $0 [COMANDO] [OPCIONES]"
    echo ""
    echo "Comandos disponibles:"
    echo "  check-deps              Verificar dependencias"
    echo "  check-conn URL          Verificar conectividad"
    echo "  stats URL               Mostrar estadísticas de BD"
    echo "  validate FILE           Validar archivo de backup"
    echo "  cleanup DIR PATTERN DAYS Limpiar archivos antiguos"
    echo "  disk-space DIR [%]     Verificar espacio en disco"
    echo "  hash FILE [ALG]        Generar hash de archivo"
    echo ""
    echo "Ejemplos:"
    echo "  $0 check-deps"
    echo "  $0 check-conn \"postgresql://user:pass@host:port/db\""
    echo "  $0 stats \"postgresql://user:pass@host:port/db\""
    echo "  $0 validate backup.dump"
    echo "  $0 cleanup ./backups \"*.dump\" 7"
    echo "  $0 disk-space ./backups 80"
    echo "  $0 hash backup.dump sha256"
}

# Función principal
main() {
    case "${1:-help}" in
        "check-deps")
            check_dependencies
            ;;
        "check-conn")
            if [ -z "$2" ]; then
                log "ERROR" "Debes proporcionar una URL de conexión"
                exit 1
            fi
            check_connectivity "$2"
            ;;
        "stats")
            if [ -z "$2" ]; then
                log "ERROR" "Debes proporcionar una URL de conexión"
                exit 1
            fi
            get_db_stats "$2"
            ;;
        "validate")
            if [ -z "$2" ]; then
                log "ERROR" "Debes proporcionar un archivo de backup"
                exit 1
            fi
            validate_backup_file "$2"
            ;;
        "cleanup")
            if [ -z "$2" ] || [ -z "$3" ] || [ -z "$4" ]; then
                log "ERROR" "Uso: cleanup DIR PATTERN DAYS"
                exit 1
            fi
            cleanup_old_files "$2" "$3" "$4"
            ;;
        "disk-space")
            if [ -z "$2" ]; then
                log "ERROR" "Debes proporcionar un directorio"
                exit 1
            fi
            check_disk_space "$2" "$3"
            ;;
        "hash")
            if [ -z "$2" ]; then
                log "ERROR" "Debes proporcionar un archivo"
                exit 1
            fi
            get_file_hash "$2" "$3"
            ;;
        "help"|"-h"|"--help")
            show_help
            ;;
        *)
            log "ERROR" "Comando desconocido: $1"
            show_help
            exit 1
            ;;
    esac
}

# Si se ejecuta directamente, ejecutar función principal
if [ "${BASH_SOURCE[0]}" = "${0}" ]; then
    main "$@"
fi
