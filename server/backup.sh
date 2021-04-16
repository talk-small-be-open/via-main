#!/bin/bash
set -eo pipefail

# Usage backup.sh stoneName duplicityTarget

./backup_gemstone_db.sh $1

if [ -n "$2" ]; then
		./backup_with_duplicity.sh $1 $2
fi
