#!/bin/bash
cd ~/stone/logs

# Delete log files, which have not been written to, since a while
find . -iname "*.log" -not -newermt "2 weeks ago" -delete

# gemnetobject log files, we have too many
find . -iname "gemnetobject*.log" -not -newermt "2 days ago" -delete

# old github caches
find github-cache/talk-small-be-open -mindepth 3 -maxdepth 3 -type d -not -newerct "4 week ago" -printf "%P\n" | xargs -I % rm -dr github-cache/talk-small-be-open/%
