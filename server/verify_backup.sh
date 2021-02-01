#!/bin/bash

# exit when any command fails
set -e

STONE_NAME=$1
BACKEND=$2

#VERBOSE=false
# while getopts "v" opt; do
# 		case ${opt} in
# 				v ) # process option v
# 						VERBOSE=true
# 						shift
# 						;;
# 				\? ) echo "Usage: cmd [-v = verbose]"
# 						 exit
# 						 ;;
# 		esac
# done

# Ensure that the GemStone backup file is from today
if test `find "$GS_HOME/server/stones/$STONE_NAME/backups/via_backup.dbf.gz" -not -newermt "12 hours ago"`
then
		echo "via backup file seems too old!"
    exit -1
fi

# Get credentials for duplicity, if any
source "/opt/via/.duplicity.cred"

# Verify the GemStone DB
TARGET=$BACKEND/via_db
duplicity verify --verbosity warning --no-encryption --include "**/via_backup.dbf.gz" --exclude "**/*" $TARGET $GS_HOME/server/stones/$STONE_NAME/backups 

# Not verifying assets, uses lot of perfomance
# # Assets
# TARGET=$BACKEND/via_assets
# duplicity verify --verbosity warning --no-encryption $TARGET /opt/via/via_base/web_root/assets 

# # Exported module PDFs and others
# TARGET=$BACKEND/via_exports
# duplicity verify --verbosity warning --no-encryption $TARGET /opt/via/export 
