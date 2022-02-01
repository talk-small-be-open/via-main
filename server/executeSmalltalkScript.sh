#!/usr/bin/env bash

# Executes Smalltalk code
# Usage: executeSmalltalk.sh <stonename> <scriptfile> [logfile]

# Set logfile
LOGFILE=${3:-"executeSmalltalk.log"}

startTopaz $1 -q -l << EOF >& /dev/null 
iferror stack
display oops
output pushnew $LOGFILE
login
run
$(cat $2)
System commitTransaction.
%
logout
exit
EOF
