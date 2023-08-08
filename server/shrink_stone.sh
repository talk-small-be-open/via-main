#!/bin/bash
set -e

# TEST FIRST!
exit

# Verkleinert die GemStone Datenbank (shrink)

STONE=$1

export GS_HOME=/opt/GsDevKit_home
STONE_DIR=$GS_HOME/server/stones/$STONE
BACKUPNAME="shrinking_gemstone.dbf"

# Prohibit that the last temporary shrinked DB data file will be used accidentally. Delete it.
BACKUPFILE=$STONE_DIR/backups/$BACKUPNAME.gz
rm -f $BACKUPFILE

# Stop all seaside processes
./monit_stop_web_gems.sh

# OPTIMIZE: Synchronously wait for monit, but does not seem possible
echo "Waiting until no topaz processes exists anymore ..."
sleep 3
while pgrep topaz > /dev/null; do sleep 1; echo -n "."; done

# object log leeren, oder zumindest die alten sachen!!!
todeIt $STONE "ol clear --age=\`1 day\`"

# GS Mark for collection
todeIt $STONE gs mfc

# Backup machen
#todeBackup $STONE $BACKUPNAME
# We need the "wait" option, therefore via todeIt. Then, a preceding sleep is not necessary anymore.
# TODO: --wait macht error, warum?
#todeIt $STONE bu backup --commit --wait $BACKUPNAME
todeIt $STONE bu backup --commit $BACKUPNAME


# Just go for sure, since we had issues, and no backup file was created without any error
[ -f "$BACKUPFILE" ] || (echo "no backup file created!" ; exit 1)

# Stone und allfälliges netldi stoppen
./monit_stop_netldi.sh
./monit_stop_stone.sh

# OPTIMIZE: Synchronously wait for monit, but does not seem possible
echo "Waiting until no stoned processes exists anymore ..."
while pgrep stoned > /dev/null; do sleep 1; echo -n "."; done

# Make backup of current DB and keep old backups
pushd $STONE_DIR/extents/
mv --backup=numbered extent0.dbf _before_shrink_extent0.dbf
popd


# HINWEIS:
# falls kein oder ein vielzugrosses tode-snapshot snapshots/extent0.tode.dbf da ist, eins erstellen:
# newExtent $STONE
# todeLoad $STONE
# stopStone $STONE
# Behalten für später und umbenennen auf $STONE_DIR/snapshots/extent0.tode.pristine.dbf
# extent brauchen wir nicht mehr: rm extent0.dbf

[ -f "$STONE_DIR/snapshots/extent0.tode.pristine.dbf" ] || (echo "no pristine extent.dbf found" ; exit 1)

# Start with new fresh extent, tode already loaded
newExtent -s $STONE_DIR/snapshots/extent0.tode.pristine.dbf -t $STONE

sleep 10

# Restore from backup file from above
todeRestore $STONE $STONE_DIR/backups/$BACKUPNAME.gz

sleep 10

# Remount seaside in tode (Not sure if needed)
todeIt $STONE mount @/sys/stone/dirs/Seaside3/tode /home seaside

# Stop the stone (implicitly started from newExtent)
stopStone -b $STONE

sleep 5

./via_start.sh

echo "Compressing the backup dbf-file to save space"
pushd $STONE_DIR/extents/
[ -f "_before_shrink_extent0.dbf.gz" ] && mv --backup=numbered _before_shrink_extent0.dbf.gz _before_shrink_extent0.dbf.gz.bak
nice pigz _before_shrink_extent0.dbf
popd
