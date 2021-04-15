#/bin/bash

# Scans the source code for UI texts. NOTE: Does not find dynamically created UI text keys.
# Use this list for a rough manual cleanup job in the via backend

# Changing into pharos git repository for our source code (base and site)
pushd ../site/pharo/pharo-local/iceberg/talk-small-be-open > /dev/null

# Scan for UI-text patterns and list all found UI texts
#egrep -r --no-filename --only-matching --include="*.st" "\'([a-zA-Z]+\:)+([a-zA-Z]+)\'" . | sed "s/'//g" | sort | uniq
egrep -r --no-filename --only-matching --include="*.st" "'([[:alpha:]][[:alnum:]]*:)+([[:alpha:]][[:alnum:]]*)'" . | sed "s/'//g" | sort | uniq

popd > /dev/null
