#!/bin/bash
# backup-full.sh - Script de backup completo para Kiniela App

# Configuración
PROJECT_URL="https://icmoifjssawaymkqkxvn.supabase.co"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backup
mkdir -p $BACKUP_DIR

echo "🔄 Iniciando backup completo de Kiniela App..."
echo "📅 Fecha: $(date)"
echo "📁 Directorio: $BACKUP_DIR"

# Nota: Reemplazar [password] con la contraseña real
echo "⚠️  NOTA: Reemplazar [password] con la contraseña real de la base de datos"
echo "📝 Comando sugerido:"
echo "pg_dump \"postgresql://postgres:[password]@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres\" --format=custom --file=\"$BACKUP_DIR/kiniela_backup_$DATE.dump\""

echo "✅ Script de backup preparado"
echo "📋 Archivo de backup: $BACKUP_DIR/kiniela_backup_$DATE.dump"

