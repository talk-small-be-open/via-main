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
$tmux new-session -d -s $SESSION

$tmux new-window    -t $SESSION:0
$tmux select-layout main-horizontal
$tmux split-window -h -p 33 -t $SESSION:0 goaccess --log-format=COMBINED /var/log/nginx/access.log
$tmux split-window -h -p 33 -t $SESSION:0 lnav /var/log/nginx/error.log
$tmux split-window -h -p 33 -t $SESSION:0 lnav ~/stone/logs/SeasideMaintenanceVM_server-instance.log
$tmux split-window -h -p 33 -t $SESSION:0 sudo watch -d -n 10 -t ~/vb/server/status.sh
$tmux split-window -v -p 50 -t $SESSION:0 tload



# $tmux new-window    -t $SESSION:0 
# $tmux split-window  -h -t $SESSION:0
# $tmux new-window    -t $SESSION:1 
# $tmux new-window    -t $SESSION:2  
# $tmux new-window    -t $SESSION:3  
# $tmux split-window  -h -t $SESSION:3
# $tmux new-window    -t $SESSION:4
# $tmux select-window -t $SESSION:0

$tmux attach -t $SESSION
