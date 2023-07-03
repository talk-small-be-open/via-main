#!/bin/bash
set -euo pipefail

# Usage backup_with_duplicity.sh stoneName duplicityTarget

STONE_NAME=$1


# Get credentials for duplicity, if any
if [ -f "/opt/via/.duplicity.cred" ]; then
		source "/opt/via/.duplicity.cred"
fi

#
# Run duplicity
#
# Backend example:
# BACKEND=s3://sos-ch-dk-2.exo.io
# BACKEND=/var/backup
BACKEND=$2
ENDPOINT=${3:-}

# GemStone DB
TARGET=$BACKEND/via_db
duplicity --log-file /opt/via/log/duplicity.log --verbosity notice --no-print-statistics --full-if-older-than 7D --no-encryption --include "**/via_backup.dbf.gz" --exclude "**/*" --s3-endpoint-url $ENDPOINT $GS_HOME/server/stones/$STONE_NAME/backups $TARGET
duplicity remove-all-but-n-full 3 --log-file /opt/via/log/duplicity.log --force --verbosity info --no-print-statistics --s3-endpoint-url $ENDPOINT $TARGET

# Assets
TARGET=$BACKEND/via_assets
duplicity --log-file /opt/via/log/duplicity.log --verbosity notice --no-print-statistics --full-if-older-than 7D --no-encryption --s3-endpoint-url $ENDPOINT /opt/via/via_base/web_root/assets $TARGET
duplicity remove-all-but-n-full 3 --log-file /opt/via/log/duplicity.log --force --verbosity info --no-print-statistics --s3-endpoint-url $ENDPOINT $TARGET

# Exported module PDFs and others
TARGET=$BACKEND/via_exports
duplicity --log-file /opt/via/log/duplicity.log --verbosity notice --no-print-statistics --full-if-older-than 7D --no-encryption --s3-endpoint-url $ENDPOINT /opt/via/export $TARGET
duplicity remove-all-but-n-full 3 --log-file /opt/via/log/duplicity.log --force --verbosity info --no-print-statistics --s3-endpoint-url $ENDPOINT $TARGET
