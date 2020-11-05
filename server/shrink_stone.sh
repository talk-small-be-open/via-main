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
rm -f $STONE_DIR/backups/$BACKUPNAME

# Stop all Seaside processes
./monit_stop_web_gems.sh
#./monit_stop_netldi.sh

# OPTIMIZE: Synchronously wait for monit, but does not seem possible
wait 20

# Start clean Netldi, had some odd problems if running for long
#./monit_start_netldi.sh

echo "Waiting until no topaz processes exists anymore ..."
while pgrep topaz  > /dev/null; do sleep 1; echo -n "."; done

# GS Mark for collection
todeIt $STONE "gs mfc" > $LOGFILE

# Backup machen
todeBackup $STONE $BACKUPNAME > $LOGFILE

# Stone und allfälliges netldi stoppen
./monit_stop_netldi.sh
./monit_stop_stone.sh

# Make backup of current DB and keep old backups
pushd $STONE_DIR/extents/
mv --backup=numbered extent0.dbf _before_shrink_extent0.dbf
popd

# Get a pristine DB
#newExtent -s /opt/321via/GsDevKit_home/shared/downloads/products/GemStone64Bit3.2.12-x86_64.Linux/seaside/data/extent0.dbf $STONE

# TODO: Optionen mit direktem reinladen? Siehe auch 321 update prozess?
# TODO: ... oder restore von snapshot ...tode.dbf.gz
#newExtent $STONE
#todeLoad $STONE

#cp $STONE_DIR/snapshots/extent0.tode.dbf $STONE_DIR/extents/extent0.dbf

newExtent -t -s $STONE_DIR/backups/$BACKUPNAME $STONE

# start stone for restore
#startStone -R $STONE

# Hat nicht funktioniert, aber das Pendant dazu via tode-Client manuell schon
# TODO: todeRestore $STONE $BACKUPNAME

# Stop & Start

stopStone $STONE

./via_start.sh
