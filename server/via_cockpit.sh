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
$tmux split-window -t $SESSION:0 sudo monit summary
$tmux split-window -t $SESSION:0 tail -f /var/log/haproxy.log
$tmux split-window -t $SESSION:0 tail -f /var/log/nginx/error.log

# $tmux new-window    -t $SESSION:0 
# $tmux split-window  -h -t $SESSION:0
# $tmux new-window    -t $SESSION:1 
# $tmux new-window    -t $SESSION:2  
# $tmux new-window    -t $SESSION:3  
# $tmux split-window  -h -t $SESSION:3
# $tmux new-window    -t $SESSION:4
# $tmux select-window -t $SESSION:0

$tmux attach -t $SESSION
