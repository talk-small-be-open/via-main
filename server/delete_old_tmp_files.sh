#!/bin/bash

pushd /opt/via/tmp

# Delete old temporary files, only known filepattern, dangerous else!
find . -not -newermt "7 days ago" \( -type f -or -type l \) \( -iname "*.zip" -or -iname "*.pdf" -or -iname "*.mp?" -or -iname "*.json" -or -iname "*.html" \) -delete

# Delete empty dirs
find . -empty -type d  -delete

popd

