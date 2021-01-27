#!/bin/bash

wget https://raw.githubusercontent.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker/master/install-ngxblocker -O /usr/local/sbin/install-ngxblocker
chmod +x /usr/local/sbin/install-ngxblocker
chmod +x /usr/local/sbin/setup-ngxblocker
chmod +x /usr/local/sbin/update-ngxblocker

pushd /usr/local/sbin
./install-ngxblocker -x

# setup, but do not insert nginx conf stuff, because we already have it (-z)
./setup-ngxblocker -x -z

popd
