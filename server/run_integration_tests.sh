#!/bin/bash

# Runs the integration tests with JMeter
# The tests need to store a log file called integration_test.log, with the success status of each JMeter test

pushd ../site/misc/jmeter/ > /dev/null

# Remove logs from previous run
rm -f integration_test.log
rm -f integration_test_details.log

# Run JMeter
jmeter -n -Jhostname=$1 -Jemail=$2 -Jmagicspell=$3 -t ./integration_test.jmx   &> /dev/null

# Check if success
if grep -q ",false," integration_test.log; then
		echo "Integration tests fail:"
		cat integration_test.log
		popd > /dev/null
		exit 1
else
		echo "OK"
		popd > /dev/null
		exit 0
fi
