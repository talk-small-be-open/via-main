#!/bin/bash

# set -e

service nginx stop && /snap/bin/certbot --standalone renew

service nginx start
