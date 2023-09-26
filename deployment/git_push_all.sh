#!/bin/bash

echo "Dont forget to add new files!"

# Base
pushd ..
git status
git commit -a -m "progress"
git pull --commit --no-edit
git push

# Site
pushd ../via_site/
git status
git commit -a -m "progress"
git pull --commit --no-edit
git push

popd
popd
