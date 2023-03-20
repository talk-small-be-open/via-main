#!/bin/bash

echo "Dont forget to add new files!"

# Base
pushd ..
git status
git commit -a -m "progress"
git pull --commit --no-edit origin
git push origin

# Site
pushd ../via_site/
git status
git commit -a -m "progress"
git pull --commit --no-edit origin
git push origin

popd
popd
