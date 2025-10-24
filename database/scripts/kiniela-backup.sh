#!/bin/bash
# kiniela-backup.sh - Script maestro para backup y restore de Kiniela App
# Integra todas las funcionalidades de backup, restore y utilidades

set -e

# Directorio del script
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Cargar configuración
if [ -f "$SCRIPT_DIR/config.sh" ]; then
    source "$SCRIPT_DIR/config.sh"
else
    echo "Error: Archivo de configuración no encontrado: $SCRIPT_DIR/config.sh"
    exit 1
fi

# Cargar utilidades
if [ -f "$SCRIPT_DIR/utils.sh" ]; then
    source "$SCRIPT_DIR/utils.sh"
else
    echo "Error: Archivo de utilidades no encontrado: $SCRIPT_DIR/utils.sh"
    exit 1
fi

# Función para mostrar menú principal
show_main_menu() {
    echo ""
    echo "=================================="
    echo "    KINIELA BACKUP & RESTORE"
    echo "=================================="
    echo ""
    echo "1. Backup completo"
    echo "2. Backup incremental"
    echo "3. Restore desde backup"
    echo "4. Verificar conectividad"
    echo "5. Estadísticas de base de datos"
    echo "6. Validar archivo de backup"
    echo "7. Limpiar archivos antiguos"
    echo "8. Verificar espacio en disco"
    echo "9. Mostrar configuración"
    echo "0. Salir"
    echo ""
    echo "=================================="
}

# Función para ejecutar backup completo
run_full_backup() {
    echo ""
    log "INFO" "Iniciando backup completo..."
    
    if [ -f "$SCRIPT_DIR/backup-full.sh" ]; then
        "$SCRIPT_DIR/backup-full.sh"
    else
        log "ERROR" "Script de backup completo no encontrado"
        return 1
    fi
}

# Función para ejecutar backup incremental
run_incremental_backup() {
    echo ""
    log "INFO" "Iniciando backup incremental..."
    
    if [ -f "$SCRIPT_DIR/backup-incremental.sh" ]; then
        "$SCRIPT_DIR/backup-incremental.sh"
    else
        log "ERROR" "Script de backup incremental no encontrado"
        return 1
    fi
}

# Función para ejecutar restore
run_restore() {
    echo ""
    log "INFO" "Iniciando proceso de restore..."
    
    # Listar archivos de backup disponibles
    local backup_files=()
    while IFS= read -r -d '' file; do
        backup_files+=("$file")
    done < <(find "$BACKUP_DIR" -name "kiniela_*.dump" -o -name "kiniela_*.sql" -print0 2>/dev/null | sort -z)
    
    if [ ${#backup_files[@]} -eq 0 ]; then
        log "WARNING" "No se encontraron archivos de backup en $BACKUP_DIR"
        return 1
    fi
    
    echo ""
    echo "Archivos de backup disponibles:"
    echo "=================================="
    
    for i in "${!backup_files[@]}"; do
        local file="${backup_files[$i]}"
        local size=$(du -h "$file" | cut -f1)
        local date=$(stat -c %y "$file" | cut -d'.' -f1)
        echo "$((i+1)). $(basename "$file") ($size, $date)"
    done
    
    echo ""
    read -p "Selecciona el número del archivo a restaurar: " selection
    
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#backup_files[@]} ]; then
        log "ERROR" "Selección inválida"
        return 1
    fi
    
    local selected_file="${backup_files[$((selection-1))]}"
    
    echo ""
    echo "Opciones de restore:"
    echo "1. Restore completo"
    echo "2. Solo esquemas"
    echo "3. Solo datos"
    echo "4. Restore con limpieza previa"
    echo ""
    read -p "Selecciona el tipo de restore: " restore_type
    
    local restore_cmd=""
    case "$restore_type" in
        "1") restore_cmd="--force" ;;
        "2") restore_cmd="--schema-only --force" ;;
        "3") restore_cmd="--data-only --force" ;;
        "4") restore_cmd="--clean --force" ;;
        *) log "ERROR" "Tipo de restore inválido" && return 1 ;;
    esac
    
    if [ -f "$SCRIPT_DIR/restore.sh" ]; then
        "$SCRIPT_DIR/restore.sh" $restore_cmd "$selected_file"
    else
        log "ERROR" "Script de restore no encontrado"
        return 1
    fi
}

# Función para verificar conectividad
check_connectivity_menu() {
    echo ""
    log "INFO" "Verificando conectividad..."
    
    local db_url=$(get_db_url)
    if check_connectivity "$db_url"; then
        log "SUCCESS" "Conexión exitosa"
    else
        log "ERROR" "Error de conexión"
        return 1
    fi
}

# Función para mostrar estadísticas
show_stats_menu() {
    echo ""
    log "INFO" "Obteniendo estadísticas..."
    
    local db_url=$(get_db_url)
    get_db_stats "$db_url"
}

# Función para validar backup
validate_backup_menu() {
    echo ""
    log "INFO" "Validando archivo de backup..."
    
    # Listar archivos de backup disponibles
    local backup_files=()
    while IFS= read -r -d '' file; do
        backup_files+=("$file")
    done < <(find "$BACKUP_DIR" -name "kiniela_*.dump" -o -name "kiniela_*.sql" -print0 2>/dev/null | sort -z)
    
    if [ ${#backup_files[@]} -eq 0 ]; then
        log "WARNING" "No se encontraron archivos de backup en $BACKUP_DIR"
        return 1
    fi
    
    echo ""
    echo "Archivos de backup disponibles:"
    echo "=================================="
    
    for i in "${!backup_files[@]}"; do
        local file="${backup_files[$i]}"
        local size=$(du -h "$file" | cut -f1)
        local date=$(stat -c %y "$file" | cut -d'.' -f1)
        echo "$((i+1)). $(basename "$file") ($size, $date)"
    done
    
    echo ""
    read -p "Selecciona el número del archivo a validar: " selection
    
    if ! [[ "$selection" =~ ^[0-9]+$ ]] || [ "$selection" -lt 1 ] || [ "$selection" -gt ${#backup_files[@]} ]; then
        log "ERROR" "Selección inválida"
        return 1
    fi
    
    local selected_file="${backup_files[$((selection-1))]}"
    validate_backup_file "$selected_file"
}

# Función para limpiar archivos antiguos
cleanup_menu() {
    echo ""
    log "INFO" "Limpiando archivos antiguos..."
    
    echo ""
    echo "Tipos de archivos a limpiar:"
    echo "1. Backups completos (.dump)"
    echo "2. Backups incrementales (.sql)"
    echo "3. Logs (.log)"
    echo "4. Todos los archivos antiguos"
    echo ""
    read -p "Selecciona el tipo de archivos: " cleanup_type
    
    case "$cleanup_type" in
        "1")
            cleanup_old_files "$BACKUP_DIR" "kiniela_backup_*.dump" "$BACKUP_RETENTION_DAYS"
            ;;
        "2")
            cleanup_old_files "$BACKUP_DIR" "kiniela_incremental_*.sql" "$INCREMENTAL_RETENTION_DAYS"
            ;;
        "3")
            cleanup_old_files "$BACKUP_DIR" "*.log" "$LOG_RETENTION_DAYS"
            ;;
        "4")
            cleanup_old_files "$BACKUP_DIR" "kiniela_backup_*.dump" "$BACKUP_RETENTION_DAYS"
            cleanup_old_files "$BACKUP_DIR" "kiniela_incremental_*.sql" "$INCREMENTAL_RETENTION_DAYS"
            cleanup_old_files "$BACKUP_DIR" "*.log" "$LOG_RETENTION_DAYS"
            ;;
        *)
            log "ERROR" "Tipo de limpieza inválido"
            return 1
            ;;
    esac
}

# Función para verificar espacio en disco
check_disk_space_menu() {
    echo ""
    log "INFO" "Verificando espacio en disco..."
    
    check_disk_space "$BACKUP_DIR" 80
}

# Función para mostrar configuración
show_config_menu() {
    echo ""
    show_config
}

# Función principal del menú
main_menu() {
    while true; do
        show_main_menu
        read -p "Selecciona una opción: " choice
        
        case "$choice" in
            "1")
                run_full_backup
                ;;
            "2")
                run_incremental_backup
                ;;
            "3")
                run_restore
                ;;
            "4")
                check_connectivity_menu
                ;;
            "5")
                show_stats_menu
                ;;
            "6")
                validate_backup_menu
                ;;
            "7")
                cleanup_menu
                ;;
            "8")
                check_disk_space_menu
                ;;
            "9")
                show_config_menu
                ;;
            "0")
                log "INFO" "Saliendo..."
                exit 0
                ;;
            *)
                log "WARNING" "Opción inválida. Intenta de nuevo."
                ;;
        esac
        
        echo ""
        read -p "Presiona Enter para continuar..."
    done
}

# Función para mostrar ayuda
show_help() {
    echo "Script maestro para backup y restore de Kiniela App"
    echo ""
    echo "Uso: $0 [OPCIÓN]"
    echo ""
    echo "Opciones:"
    echo "  -h, --help              Mostrar esta ayuda"
    echo "  -m, --menu              Mostrar menú interactivo (por defecto)"
    echo "  -b, --backup            Ejecutar backup completo"
    echo "  -i, --incremental       Ejecutar backup incremental"
    echo "  -r, --restore FILE      Restaurar desde archivo"
    echo "  -c, --check             Verificar conectividad"
    echo "  -s, --stats             Mostrar estadísticas"
    echo "  -v, --validate FILE     Validar archivo de backup"
    echo "  -l, --cleanup           Limpiar archivos antiguos"
    echo "  -d, --disk-space        Verificar espacio en disco"
    echo "  --config                Mostrar configuración"
    echo ""
    echo "Ejemplos:"
    echo "  $0                      # Mostrar menú interactivo"
    echo "  $0 --backup             # Backup completo"
    echo "  $0 --incremental        # Backup incremental"
    echo "  $0 --restore backup.dump # Restore desde archivo"
    echo "  $0 --check              # Verificar conectividad"
    echo "  $0 --stats              # Mostrar estadísticas"
    echo ""
}

# Función principal
main() {
    # Verificar configuración
    if ! check_config; then
        log "ERROR" "Configuración inválida. Revisa las variables de entorno."
        exit 1
    fi
    
    # Parsear argumentos de línea de comandos
    case "${1:-menu}" in
        "-h"|"--help")
            show_help
            ;;
        "-m"|"--menu"|"menu")
            main_menu
            ;;
        "-b"|"--backup")
            run_full_backup
            ;;
        "-i"|"--incremental")
            run_incremental_backup
            ;;
        "-r"|"--restore")
            if [ -z "$2" ]; then
                log "ERROR" "Debes especificar un archivo de backup"
                exit 1
            fi
            if [ -f "$SCRIPT_DIR/restore.sh" ]; then
                "$SCRIPT_DIR/restore.sh" --force "$2"
            else
                log "ERROR" "Script de restore no encontrado"
                exit 1
            fi
            ;;
        "-c"|"--check")
            check_connectivity_menu
            ;;
        "-s"|"--stats")
            show_stats_menu
            ;;
        "-v"|"--validate")
            if [ -z "$2" ]; then
                log "ERROR" "Debes especificar un archivo de backup"
                exit 1
            fi
            validate_backup_file "$2"
            ;;
        "-l"|"--cleanup")
            cleanup_menu
            ;;
        "-d"|"--disk-space")
            check_disk_space_menu
            ;;
        "--config")
            show_config_menu
            ;;
        *)
            log "ERROR" "Opción desconocida: $1"
            show_help
            exit 1
            ;;
    esac
}

# Manejo de señales
trap 'log "WARNING" "Script interrumpido por el usuario"; exit 130' INT TERM

# Ejecutar función principal
main "$@"
