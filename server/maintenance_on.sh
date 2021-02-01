#!/bin/bash

sudo ln -s /etc/nginx/sites-available/000_maintenance /etc/nginx/sites-enabled/

sudo rm -f /etc/nginx/sites-enabled/via.vhost
sudo rm -f /etc/nginx/sites-enabled/default

sudo service nginx reload
