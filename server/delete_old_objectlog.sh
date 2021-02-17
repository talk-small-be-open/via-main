#!/bin/bash
set -euxo pipefail

STONE=$1

# todeIt $STONE ol clear --age=\`7 days\` transcript info trace
# todeIt $STONE ol clear --age=\`30 days\` error

# Strange that todeIt writes some text to stderr instead stdout, we redirect. Errors are catched through exit code.
todeIt $STONE ol clear --age=\`7 days\` 2>&1
