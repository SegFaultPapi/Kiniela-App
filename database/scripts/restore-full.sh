#!/bin/bash
# restore-full.sh - Script de restore completo para Kiniela App

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "❌ Error: Archivo de backup no especificado"
  echo "📖 Uso: ./restore-full.sh <archivo_backup>"
  echo "📝 Ejemplo: ./restore-full.sh ./backups/kiniela_backup_20241224_020000.dump"
  exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
  echo "❌ Error: Archivo de backup no encontrado: $BACKUP_FILE"
  exit 1
fi

echo "🔄 Iniciando restore completo de Kiniela App..."
echo "📅 Fecha: $(date)"
echo "📁 Archivo: $BACKUP_FILE"

# Nota: Reemplazar [password] con la contraseña real
echo "⚠️  NOTA: Reemplazar [password] con la contraseña real de la base de datos"
echo "📝 Comando sugerido:"
echo "pg_restore \"postgresql://postgres:[password]@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres\" --clean --if-exists --verbose $BACKUP_FILE"

echo "✅ Script de restore preparado"
echo "⚠️  ADVERTENCIA: Este proceso reemplazará todos los datos existentes"

