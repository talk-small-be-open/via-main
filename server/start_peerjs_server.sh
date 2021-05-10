#!/bin/bash

# See https://github.com/peers/peerjs-server
# Loooong alive timeout 30 minutes , since we want to keep connections while pausing the games (though not sure if thats the correct way)
peerjs --port 9001 --key peerjs --path /peerjs --proxied true --expire_timeout 60000 --alive_timeout 1800000 >> /var/log/peerjs.log
