#!/bin/bash
# database/backup.sh
# Creates a timestamped pg_dump file into /var/backups/mcc (create that dir or mount)
set -euo pipefail

BACKUP_DIR=${BACKUP_DIR:-/var/backups/mcc}
mkdir -p "${BACKUP_DIR}"

TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
FILENAME="${BACKUP_DIR}/mcc_backup_${TIMESTAMP}.sql"

PGHOST=${DB_HOST:-localhost}
PGPORT=${DB_PORT:-5432}
PGUSER=${DB_USER:-postgres}
PGDATABASE=${DB_NAME:-mcc}

export PGPASSWORD=${DB_PASSWORD:-}

echo "Creating backup: ${FILENAME}"
pg_dump -h "$PGHOST" -p "$PGPORT" -U "$PGUSER" -F c -b -v -f "${FILENAME}" "$PGDATABASE"

echo "Backup completed: ${FILENAME}"
