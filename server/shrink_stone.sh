#!/bin/bash

# Verkleinert die GemStone Datenbank (shrink)

# WICHTIG!!!!
# Dieses Script ist noch nicht gut getestet. Nur manuell die einzelnen Schritte durchführen
exit

STONE=$1

export GS_HOME=/opt/GsDevKit_home
STONE_DIR=$GS_HOME/server/stones/$STONE
BACKUPNAME="shrinking_gemstone.dbf"
LOGFILE="shrink.log"
rm -f $LOGFILE

# Prohibit that the last temporary shrinked DB data file will be used accidentally. Delete it.
rm -f $STONE_DIR/backups/$BACKUPNAME.gz

# Stop all seaside processes
./monit_stop_web_gems.sh
#./monit_stop_netldi.sh

# OPTIMIZE: Synchronously wait for monit, but does not seem possible
wait 20

echo "Waiting until no topaz processes exists anymore ..."
while pgrep topaz  > /dev/null; do sleep 1; echo -n "."; done

# TODO! object log leeren, oder zumindest die alten sachen!!!
todeIt $STONE "ol clear --age=\`1 day\`" > $LOGFILE

# GS Mark for collection
todeIt $STONE "gs mfc" > $LOGFILE

# Backup machen
todeBackup $STONE $BACKUPNAME > $LOGFILE

# Stone und allfälliges netldi stoppen
./monit_stop_netldi.sh
./monit_stop_stone.sh

# OPTIMIZE: Synchronously wait for monit, but does not seem possible
wait 10

echo "Waiting until no stoned processes exists anymore ..."
while pgrep stoned > /dev/null; do sleep 1; echo -n "."; done

# Make backup of current DB and keep old backups
pushd $STONE_DIR/extents/
mv --backup=numbered extent0.dbf _before_shrink_extent0.dbf
popd

# # -t oder -a? um die tode Struktur beizubehalten
# newExtent -t -s $STONE_DIR/backups/$BACKUPNAME $STONE
# # Oder?  todeIt ViaSiteTdu mount @/sys/stone/dirs/Seaside3/tode /home seaside

# Alternativ, wegen blödem login disabled Fehler
# newExtent $STONE
# todeLoad $STONE
# todeIt $STONE "script --script=rebuildServerTode"
# todeRestore $STONE $STONE_DIR/backups/shrinking_gemstone.dbf.gz
# todeIt $STONE  mount @/sys/stone/dirs/Seaside3/tode /home seaside


# GEHT!!!
# falls kein tode-snapshot da ist, eins erstellen:
# takes the extent0.seaside.dbf as template
#newExtent $STONE
#todeLoad $STONE

newExtent -s $STONE_DIR/snapshots/extent0.tode.dbf -t $STONE
todeRestore $STONE $STONE_DIR/backups/$BACKUPNAME.gz
todeIt $STONE mount @/sys/stone/dirs/Seaside3/tode /home seaside

#wird nicht mehr gebraucht todeIt $STONE "script --script=rebuildServerTode"




stopStone -b $STONE

./via_start.sh
