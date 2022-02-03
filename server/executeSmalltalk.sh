#!/usr/bin/env bash

# Executes Smalltalk code
# Usage: executeSmalltalk.sh <stonename> "smalltalk code" [logfile]

# Set logfile
LOGFILE=${3:-"executeSmalltalk.log"}

# Get smalltalk code
CODE=$2

# Ensure Smalltalk code ends with a dot
if [[ "$CODE" != *. ]]; then
		CODE="$CODE."
fi

startTopaz $1 -q -l << EOF >& /dev/null 
iferror stack
display oops
output pushnew $LOGFILE
login
run
$CODE
System commitTransaction.
%
logout
exit
EOF
