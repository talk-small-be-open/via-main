#!/bin/bash

sudo monit -B summary
echo
ls -sh ~/stone/extents/extent*.dbf
echo
ls -lh ~/stone/backups/via_backup* | awk '{print $5"\t"$6" "$7" "$8" "$9}'
echo
df -h /
