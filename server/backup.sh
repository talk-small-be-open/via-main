#!/bin/bash
set -eo pipefail

# Usage backup.sh stoneName duplicityTarget endpointUrl

STONE=$1
BACKEND=${2:-}
ENDPOINT=${3:-}

./backup_gemstone_db.sh $STONE

if [ -n "$BACKEND" ]; then
		./backup_with_duplicity.sh $STONE "$BACKEND" "$ENDPOINT"
fi
