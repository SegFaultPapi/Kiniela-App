#!/bin/bash
# backup-incremental.sh - Script de backup incremental para Kiniela App
# Realiza backup solo de datos modificados desde el último backup

set -e  # Salir si cualquier comando falla

# Configuración
PROJECT_URL="https://icmoifjssawaymkqkxvn.supabase.co"
PROJECT_REF="icmoifjssawaymkqkxvn"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)
INCREMENTAL_FILE="kiniela_incremental_$DATE.sql"
LOG_FILE="$BACKUP_DIR/incremental_$DATE.log"

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

# Obtener timestamp del último backup
get_last_backup_time() {
    local last_backup_file=$(find "$BACKUP_DIR" -name "kiniela_backup_*.dump" -o -name "kiniela_incremental_*.sql" | sort | tail -1)
    
    if [ -z "$last_backup_file" ]; then
        warning "No se encontró backup anterior. Usando timestamp de hace 24 horas."
        echo "$(date -d '24 hours ago' '+%Y-%m-%d %H:%M:%S')"
        return
    fi
    
    local last_modified=$(stat -c %y "$last_backup_file" | cut -d'.' -f1)
    log "Último backup encontrado: $last_backup_file"
    log "Modificado: $last_modified"
    
    echo "$last_modified"
}

# Backup incremental de usuarios
backup_users_incremental() {
    local db_url="$1"
    local since_time="$2"
    local backup_path="$3"
    
    log "Backup incremental de usuarios desde: $since_time"
    
    cat >> "$backup_path" << EOF

-- ==============================================
-- BACKUP INCREMENTAL DE USERS
-- ==============================================

-- Usuarios modificados desde $since_time
INSERT INTO users (id, fid, address, display_name, created_at, updated_at)
SELECT id, fid, address, display_name, created_at, updated_at
FROM users
WHERE updated_at > '$since_time'
ON CONFLICT (id) DO UPDATE SET
    fid = EXCLUDED.fid,
    address = EXCLUDED.address,
    display_name = EXCLUDED.display_name,
    updated_at = EXCLUDED.updated_at;

EOF
}

# Backup incremental de mercados
backup_markets_incremental() {
    local db_url="$1"
    local since_time="$2"
    local backup_path="$3"
    
    log "Backup incremental de mercados desde: $since_time"
    
    cat >> "$backup_path" << EOF

-- ==============================================
-- BACKUP INCREMENTAL DE MARKETS
-- ==============================================

-- Mercados modificados desde $since_time
INSERT INTO markets (id, title, description, category, outcome_a, outcome_b, end_date, creator_id, total_volume, status, created_at, updated_at)
SELECT id, title, description, category, outcome_a, outcome_b, end_date, creator_id, total_volume, status, created_at, updated_at
FROM markets
WHERE updated_at > '$since_time'
ON CONFLICT (id) DO UPDATE SET
    title = EXCLUDED.title,
    description = EXCLUDED.description,
    category = EXCLUDED.category,
    outcome_a = EXCLUDED.outcome_a,
    outcome_b = EXCLUDED.outcome_b,
    end_date = EXCLUDED.end_date,
    creator_id = EXCLUDED.creator_id,
    total_volume = EXCLUDED.total_volume,
    status = EXCLUDED.status,
    updated_at = EXCLUDED.updated_at;

EOF
}

# Backup incremental de posiciones
backup_positions_incremental() {
    local db_url="$1"
    local since_time="$2"
    local backup_path="$3"
    
    log "Backup incremental de posiciones desde: $since_time"
    
    cat >> "$backup_path" << EOF

-- ==============================================
-- BACKUP INCREMENTAL DE POSITIONS
-- ==============================================

-- Posiciones modificadas desde $since_time
INSERT INTO positions (id, user_id, market_id, outcome, amount, price, created_at)
SELECT id, user_id, market_id, outcome, amount, price, created_at
FROM positions
WHERE created_at > '$since_time'
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    market_id = EXCLUDED.market_id,
    outcome = EXCLUDED.outcome,
    amount = EXCLUDED.amount,
    price = EXCLUDED.price;

EOF
}

# Backup incremental de transacciones
backup_transactions_incremental() {
    local db_url="$1"
    local since_time="$2"
    local backup_path="$3"
    
    log "Backup incremental de transacciones desde: $since_time"
    
    cat >> "$backup_path" << EOF

-- ==============================================
-- BACKUP INCREMENTAL DE TRANSACTIONS
-- ==============================================

-- Transacciones modificadas desde $since_time
INSERT INTO transactions (id, user_id, market_id, tx_hash, amount, type, outcome, created_at)
SELECT id, user_id, market_id, tx_hash, amount, type, outcome, created_at
FROM transactions
WHERE created_at > '$since_time'
ON CONFLICT (id) DO UPDATE SET
    user_id = EXCLUDED.user_id,
    market_id = EXCLUDED.market_id,
    tx_hash = EXCLUDED.tx_hash,
    amount = EXCLUDED.amount,
    type = EXCLUDED.type,
    outcome = EXCLUDED.outcome;

EOF
}

# Crear backup incremental
create_incremental_backup() {
    local db_url="$1"
    local since_time="$2"
    local backup_path="$BACKUP_DIR/$INCREMENTAL_FILE"
    
    log "Creando backup incremental desde: $since_time"
    
    # Crear archivo de backup con header
    cat > "$backup_path" << EOF
-- Backup incremental de Kiniela App
-- Fecha: $(date)
-- Desde: $since_time
-- Generado por: backup-incremental.sh

BEGIN;

EOF
    
    # Agregar backups incrementales de cada tabla
    backup_users_incremental "$db_url" "$since_time" "$backup_path"
    backup_markets_incremental "$db_url" "$since_time" "$backup_path"
    backup_positions_incremental "$db_url" "$since_time" "$backup_path"
    backup_transactions_incremental "$db_url" "$since_time" "$backup_path"
    
    # Cerrar transacción
    echo "COMMIT;" >> "$backup_path"
    
    success "Backup incremental creado: $backup_path"
    
    # Verificar tamaño del archivo
    local file_size=$(du -h "$backup_path" | cut -f1)
    log "Tamaño del archivo de backup: $file_size"
}

# Verificar integridad del backup
verify_backup() {
    local backup_path="$BACKUP_DIR/$INCREMENTAL_FILE"
    
    log "Verificando integridad del backup incremental..."
    
    if [ ! -f "$backup_path" ]; then
        error "Archivo de backup no encontrado: $backup_path"
    fi
    
    if [ ! -s "$backup_path" ]; then
        warning "El archivo de backup está vacío (no hay cambios desde el último backup)"
        return 0
    fi
    
    # Verificar sintaxis SQL básica
    if ! grep -q "BEGIN;" "$backup_path" || ! grep -q "COMMIT;" "$backup_path"; then
        error "El archivo de backup no tiene estructura SQL válida"
    fi
    
    success "Integridad del backup incremental verificada"
}

# Mostrar estadísticas
show_statistics() {
    local db_url="$1"
    local since_time="$2"
    
    log "Estadísticas de cambios desde: $since_time"
    
    echo "=================================="
    
    # Contar cambios por tabla
    local users_count=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM users WHERE updated_at > '$since_time';" | tr -d ' ')
    local markets_count=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM markets WHERE updated_at > '$since_time';" | tr -d ' ')
    local positions_count=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM positions WHERE created_at > '$since_time';" | tr -d ' ')
    local transactions_count=$(psql "$db_url" -t -c "SELECT COUNT(*) FROM transactions WHERE created_at > '$since_time';" | tr -d ' ')
    
    echo "👥 Usuarios modificados: $users_count"
    echo "📊 Mercados modificados: $markets_count"
    echo "💰 Posiciones nuevas: $positions_count"
    echo "💳 Transacciones nuevas: $transactions_count"
    
    local total_changes=$((users_count + markets_count + positions_count + transactions_count))
    echo "📈 Total de cambios: $total_changes"
    echo "=================================="
}

# Función principal
main() {
    echo "🔄 Iniciando backup incremental de Kiniela App..."
    echo "📅 Fecha: $(date)"
    echo "📁 Directorio: $BACKUP_DIR"
    echo ""
    
    # Verificaciones previas
    check_dependencies
    check_env
    setup_backup_dir
    
    # Configurar conexión
    local db_url="postgresql://postgres:$SUPABASE_DB_PASSWORD@db.$PROJECT_REF.supabase.co:5432/postgres"
    
    # Obtener timestamp del último backup
    local since_time=$(get_last_backup_time)
    log "Backup incremental desde: $since_time"
    
    # Mostrar estadísticas
    show_statistics "$db_url" "$since_time"
    
    # Crear backup incremental
    create_incremental_backup "$db_url" "$since_time"
    
    # Verificaciones posteriores
    verify_backup
    
    # Información final
    log "Backup incremental completado:"
    echo "=================================="
    echo "📅 Fecha: $(date)"
    echo "📁 Directorio: $BACKUP_DIR"
    echo "📄 Archivo: $INCREMENTAL_FILE"
    echo "📋 Log: $LOG_FILE"
    echo "💾 Tamaño: $(du -h "$BACKUP_DIR/$INCREMENTAL_FILE" | cut -f1)"
    echo "=================================="
    
    success "Backup incremental completado exitosamente!"
}

# Manejo de señales
trap 'error "Backup incremental interrumpido por el usuario"' INT TERM

# Ejecutar función principal
main "$@"
