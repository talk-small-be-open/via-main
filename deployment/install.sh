#!/bin/bash

# Installs a via server from scratch
#
# Usage: ./install.sh <name of instance>
# Example: ./install.sh production


while getopts "C" opt; do
		case ${opt} in
				# g ) GEMSTONE_ONLY="-e gemstoneOnly=true"
				# 		;;
				# s ) SKIP_BACKUP="-e skipBackup=true"
				# 		;;
				C ) CHECK_ONLY="--check"
						;;
				\? ) echo "Usage: cmd [-C = check only]"
						 exit
						 ;;
		esac
done

shift $((OPTIND-1))

# initially needed?: --ask-become-pass
ansible-playbook $CHECK_ONLY --ask-become-pass -i ./site/inventory_$1.yml -e instanceName=$1 playbook_install.yml
