#!/bin/bash

# See https://github.com/peers/peerjs-server
peerjs --port 9001 --key peerjs --path /peerjs --proxied true --expire_timeout 60000 --alive_timeout 180000 >> /var/log/peerjs.log
