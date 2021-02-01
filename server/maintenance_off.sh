#!/bin/bash

sudo rm -f /etc/nginx/sites-enabled/000_maintenance
sudo service nginx reload
