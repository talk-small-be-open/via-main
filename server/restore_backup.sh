#!/bin/bash

echo "not production ready"
exit -1

# Usage .sh stoneName duplicitySource

STONE_NAME=$1
BACKEND=$2

# BACKUP_FOLDER=/tmp/via-restore-backup
# mkdir -f $BACKUP_FOLDER

# Get credentials for duplicity, if any
if [ -f "/opt/via/.duplicity.cred" ]; then
		source "/opt/via/.duplicity.cred"
fi

# Maybe ask for name of backup? Take latest

# Stop GemStone processes
./monit_stop_web_gems.sh
./monit_stop_stone.sh


#
# restores with duplicity
#

# GemStone DB
SOURCE=$BACKEND/via_db
duplicity restore --log-file /opt/via/log/duplicity-restore.log --verbosity notice $SOURCE $GS_HOME/server/stones/$STONE_NAME/restored

# Assets
# OPTIMIZE: Nur die neuen zurückholen! Spart traffic.
SOURCE=$BACKEND/via_assets
duplicity restore --log-file /opt/via/log/duplicity-restore.log --verbosity notice $SOURCE /opt/via/via_base/web_root/assets

# DO NOT restore exported module PDFs and others, makes no sense


# mv away the current DB
pushd $GS_HOME/server/stones/$STONE_NAME
mv --backup extents/extent0.dbf extents/_extent0.dbf
gunzip -c restored/via_backup.dbf.gz > extents/extent0.dbf

# Remove tranlogs
rm tranlogs/tranlog*.dbf

# Start GemStone in recover mode and stop again
startStone -R $STONE_NAME
stopStone $STONE_NAME

# Restart GemStone
./monit_start_stone.sh
./monit_start_web_gems.sh

