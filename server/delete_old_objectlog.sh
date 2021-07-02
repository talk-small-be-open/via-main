#!/bin/bash

STONE=$1

# todeIt $STONE ol clear --age=\`7 days\` transcript info trace
# todeIt $STONE ol clear --age=\`30 days\` error

# Strange that todeIt writes some text to stderr instead stdout, we redirect. Errors are catched through exit code.

# Bug in tODE, we need to state either continuation or priorities, else age would be ignored, and ALL cleared.

# TBD: Wait, until age-ignoring-bug is implemented from my pull request in tode, then:
# # Clean heavy weight continuations from seaside errors (would blow up repository)
# todeIt $STONE ol clear --continuation --age=\`7 days\`   2>&1

# # Clean very old info entries
# todeIt $STONE ol clear --age=\`180 days\` info transcript trace  2>&1

todeIt $STONE ol clear   2>&1
