#!/bin/bash
set -e

# TODO?
# 

# Example:
# ./sync_from_server.sh newserver.domain.com ubuntu ViaSiteXyz
# run as normal user, not root

# vars
SERVER=$1
USER=$2
STONE=$3

ASSETS_PATH=/opt/via/via_base/web_root/assets/
MYSELF=$(whoami)

read -n 1 -p "GemStone on other server is stopped? y/n" SELECTION
if [ $SELECTION != 'y' ]; then
		exit
fi

# Ensure via application is stopped
# stopStone -b $STONE
./via_stop.sh

echo "Waiting for GemStone to shut down "
while pgrep stoned > /dev/null; do sleep 1; echo -n "."; done

# backup the current extent
LOCAL_EXTENT="/home/$MYSELF/stone/extents/extent0.dbf"

if [ -f $LOCAL_EXTENT ]; then
	 mv --backup $LOCAL_EXTENT $LOCAL_EXTENT.bak

	 # Delete all local tranlogs
	 rm ~/stone/tranlogs/tranlog*.dbf
fi

# Copy the extent from server
echo "Copying the GemStone extent database file ..."
scp -C $USER@$SERVER:~/stone/extents/extent0.dbf $LOCAL_EXTENT

# rsync asset files, ensure no deletion
echo "Syncing the assets ..."
rsync -rlptgoD --progress --compress --usermap=$USER:$MYSELF $USER@$SERVER:$ASSETS_PATH $ASSETS_PATH


echo "Finished. You might want to do this manually: Copy the backup credentials, ..."
