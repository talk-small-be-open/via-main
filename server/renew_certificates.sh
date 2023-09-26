#!/bin/bash

# set -e

service nginx stop && /snap/bin/certbot renew -q --standalone

service nginx start
