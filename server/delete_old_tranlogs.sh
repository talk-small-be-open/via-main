#!/bin/bash
set -eo pipefail

cd ~/stone/tranlogs

# Keep the newest 4 tranlogs (=> +5)
ls -t tranlog*.dbf | tail -n +5 | xargs rm -f --
