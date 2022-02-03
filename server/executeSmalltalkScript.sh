#!/usr/bin/env bash

# Executes Smalltalk code
# Usage: executeSmalltalk.sh <stonename> <scriptfile> [logfile]

# Set logfile
LOGFILE=${3:-"executeSmalltalk.log"}

# read code from file
CODE=$(cat $2)

# Ensure ends with a dot
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
