#!/bin/bash

# Updates the GemStone keyfile only
#
# Example: ./update_gemstone_keyfile.sh production

./update.sh $1 -t gemstone_keyfile
