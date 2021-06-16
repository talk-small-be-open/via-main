#!/bin/bash

pushd "$( dirname "${BASH_SOURCE[0]}" )"

export NODE_PATH=$(npm root -g)

./talkmaster.js 2>&1  >> /var/log/talkmaster.log &

popd
