#!/bin/bash

# set -e

service nginx stop && certbot --standalone renew

service nginx start
