#!/bin/bash

# Usage *.sh backend endpoint

# Get credentials for duplicity, if any
if [ -f "/opt/via/.duplicity.cred" ]; then
		source "/opt/via/.duplicity.cred"
fi

BACKEND=$1
ENDPOINT=${2:-}
VERBOSE=false

while getopts "v" opt; do
		case ${opt} in
				v ) # process option v
						VERBOSE=true
						shift
						;;
				\? ) echo "Usage: cmd [-v = verbose]"
						 exit
						 ;;
		esac
done


# GemStone DB
echo -e "GEMSTONE DATABASE\n================"
TARGET=$BACKEND/via_db
duplicity collection-status --verbosity warning --s3-endpoint-url $ENDPOINT $TARGET
[ "$VERBOSE" = "true" ] && duplicity list-current-files --verbosity warning --s3-endpoint-url $ENDPOINT $TARGET

# Assets
echo -e "ASSETS\n========"
TARGET=$BACKEND/via_assets
duplicity collection-status --verbosity warning --s3-endpoint-url $ENDPOINT $TARGET
[ "$VERBOSE" = "true" ] && duplicity list-current-files --verbosity warning --s3-endpoint-url $ENDPOINT $TARGET

# Exported module PDFs and others
echo -e "EXPORTS\n========"
TARGET=$BACKEND/via_exports
duplicity collection-status --verbosity warning --s3-endpoint-url $ENDPOINT $TARGET
[ "$VERBOSE" = "true" ] && duplicity list-current-files --verbosity warning --s3-endpoint-url $ENDPOINT $TARGET
