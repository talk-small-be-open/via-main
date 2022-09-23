#!/bin/bash

SESSION=viacockpit
tmux="tmux -2"

# if the session is already running, just attach to it.
$tmux has-session -t $SESSION
if [ $? -eq 0 ]; then
       echo "Session $SESSION already exists. Attaching."
       sleep 1
       $tmux attach -t $SESSION
       exit 0;
fi
                                 
# create a new session, named $SESSION, and detach from it
$tmux new-session -d -s $SESSION 'goaccess --log-format=COMBINED --no-query-string --ignore-crawlers /var/log/nginx/access.log'

# $tmux new-window    -t $SESSION:0 'goaccess --log-format=COMBINED /var/log/nginx/access.log'
# $tmux select-layout main-horizontal
# $tmux split-window -h -t $SESSION:0 goaccess --log-format=COMBINED /var/log/nginx/access.log
$tmux split-window -h -t $SESSION:0 sudo iftop
$tmux split-window -h -t $SESSION:0 lnav /var/log/nginx/error.log
$tmux split-window -h -t $SESSION:0 lnav ~/stone/logs/SeasideMaintenanceVM_server-instance.log
$tmux split-window -h -t $SESSION:0 'sudo watch -d -n 10 -t ~/vb/server/status.sh'
$tmux split-window -v -t $SESSION:0 tload --delay 60

$tmux select-layout main-horizontal


# $tmux new-window    -t $SESSION:0 
# $tmux split-window  -h -t $SESSION:0
# $tmux new-window    -t $SESSION:1 
# $tmux new-window    -t $SESSION:2  
# $tmux new-window    -t $SESSION:3  
# $tmux split-window  -h -t $SESSION:3
# $tmux new-window    -t $SESSION:4
# $tmux select-window -t $SESSION:0

$tmux attach -t $SESSION
