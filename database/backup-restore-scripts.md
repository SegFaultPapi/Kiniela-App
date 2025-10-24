# Scripts de Backup y Restore para Kiniela App

## Backup Scripts

### 1. Backup completo de la base de datos
```bash
#!/bin/bash
# backup-full.sh

# Configuración
PROJECT_URL="https://icmoifjssawaymkqkxvn.supabase.co"
BACKUP_DIR="./backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Crear directorio de backup
mkdir -p $BACKUP_DIR

# Backup usando pg_dump
pg_dump "postgresql://postgres:[password]@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres" \
  --format=custom \
  --file="$BACKUP_DIR/kiniela_backup_$DATE.dump"

echo "Backup completo creado: $BACKUP_DIR/kiniela_backup_$DATE.dump"
```

### 2. Backup de datos específicos
```bash
#!/bin/bash
# backup-data.sh

# Backup solo de datos (sin esquema)
pg_dump "postgresql://postgres:[password]@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres" \
  --data-only \
  --format=custom \
  --file="$BACKUP_DIR/kiniela_data_$DATE.dump"

echo "Backup de datos creado: $BACKUP_DIR/kiniela_data_$DATE.dump"
```

### 3. Backup usando Supabase CLI
```bash
#!/bin/bash
# backup-supabase-cli.sh

# Instalar Supabase CLI si no está instalado
# npm install -g supabase

# Login a Supabase
supabase login

# Backup del proyecto
supabase db dump --project-ref icmoifjssawaymkqkxvn \
  --file "$BACKUP_DIR/supabase_backup_$DATE.sql"

echo "Backup Supabase CLI creado: $BACKUP_DIR/supabase_backup_$DATE.sql"
```

## Restore Scripts

### 1. Restore completo
```bash
#!/bin/bash
# restore-full.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: ./restore-full.sh <archivo_backup>"
  exit 1
fi

# Restore usando pg_restore
pg_restore "postgresql://postgres:[password]@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres" \
  --clean \
  --if-exists \
  --verbose \
  $BACKUP_FILE

echo "Restore completado desde: $BACKUP_FILE"
```

### 2. Restore de datos específicos
```bash
#!/bin/bash
# restore-data.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: ./restore-data.sh <archivo_backup>"
  exit 1
fi

# Restore solo datos
pg_restore "postgresql://postgres:[password]@db.icmoifjssawaymkqkxvn.supabase.co:5432/postgres" \
  --data-only \
  --verbose \
  $BACKUP_FILE

echo "Restore de datos completado desde: $BACKUP_FILE"
```

## Scripts de Mantenimiento

### 1. Limpieza de backups antiguos
```bash
#!/bin/bash
# cleanup-backups.sh

BACKUP_DIR="./backups"
DAYS_TO_KEEP=30

# Eliminar backups más antiguos que 30 días
find $BACKUP_DIR -name "*.dump" -mtime +$DAYS_TO_KEEP -delete
find $BACKUP_DIR -name "*.sql" -mtime +$DAYS_TO_KEEP -delete

echo "Backups antiguos eliminados (más de $DAYS_TO_KEEP días)"
```

### 2. Verificación de integridad
```bash
#!/bin/bash
# verify-backup.sh

BACKUP_FILE=$1

if [ -z "$BACKUP_FILE" ]; then
  echo "Uso: ./verify-backup.sh <archivo_backup>"
  exit 1
fi

# Verificar integridad del backup
pg_restore --list $BACKUP_FILE > /dev/null

if [ $? -eq 0 ]; then
  echo "✅ Backup válido: $BACKUP_FILE"
else
  echo "❌ Backup corrupto: $BACKUP_FILE"
  exit 1
fi
```

## Automatización con Cron

### Configurar backups automáticos
```bash
# Editar crontab
crontab -e

# Backup diario a las 2 AM
0 2 * * * /path/to/backup-full.sh

# Limpieza semanal los domingos a las 3 AM
0 3 * * 0 /path/to/cleanup-backups.sh
```

## Uso con MCP Supabase

### Backup usando MCP
```bash
# Exportar datos específicos
supabase-kiniela export-data --table users --format json
supabase-kiniela export-data --table markets --format json
```

### Restore usando MCP
```bash
# Importar datos
supabase-kiniela import-data --table users --file users_backup.json
supabase-kiniela import-data --table markets --file markets_backup.json
```

## Notas Importantes

1. **Contraseñas**: Reemplazar `[password]` con la contraseña real de la base de datos
2. **Permisos**: Asegurar que los scripts tengan permisos de ejecución (`chmod +x`)
3. **Espacio**: Monitorear el espacio en disco para los backups
4. **Testing**: Probar los scripts de restore en un entorno de desarrollo primero
5. **Seguridad**: Mantener los backups en un lugar seguro y encriptado si es necesario

## Estructura de Directorios Recomendada

```
backups/
├── daily/
│   ├── kiniela_backup_20241224_020000.dump
│   └── kiniela_backup_20241225_020000.dump
├── weekly/
│   └── kiniela_backup_20241222_020000.dump
├── monthly/
│   └── kiniela_backup_20241201_020000.dump
└── scripts/
    ├── backup-full.sh
    ├── restore-full.sh
    └── cleanup-backups.sh
```



