#!/bin/bash

# Usage *.sh duplicityTarget

# Get credentials for duplicity, if any
source "/opt/via/.duplicity.cred"

BACKEND=$1
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
duplicity collection-status --verbosity warning $TARGET
if [ "$VERBOSE"="true" ]; then duplicity list-current-files --verbosity warning $TARGET; fi

# Assets
echo -e "ASSETS\n========"
TARGET=$BACKEND/via_assets
duplicity collection-status --verbosity warning $TARGET
if [ "$VERBOSE"="true" ]; then duplicity list-current-files --verbosity warning $TARGET; fi

# Exported module PDFs and others
echo -e "EXPORTS\n========"
TARGET=$BACKEND/via_exports
duplicity collection-status --verbosity warning $TARGET
if [ "$VERBOSE"="true" ]; then duplicity list-current-files --verbosity warning $TARGET; fi
