#!/bin/bash

STONE=$1

# Strange that todeIt writes some text to stderr instead stdout, we redirect. Errors are catched through exit code.

# Clean heavy weight continuations from seaside errors (would blow up repository)
# Leaving the text-error in the object log
todeIt $STONE ol clear --continuation --age=\`7 days\`  2>&1

# Clean very old error text entries
todeIt $STONE ol clear --age=\`365 days\` error  2>&1

# Clean very old info entries
todeIt $STONE ol clear --age=\`90 days\` info transcript trace  2>&1
