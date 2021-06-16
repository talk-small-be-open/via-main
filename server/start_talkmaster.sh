#!/bin/bash

pushd "$( dirname "${BASH_SOURCE[0]}" )"

./talkmaster.js >> /var/log/talkmaster.log

popd
