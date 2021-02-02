#!/bin/bash

sudo ln -fs /etc/nginx/sites-available/000_maintenance /etc/nginx/sites-enabled/

sudo rm -f /etc/nginx/sites-enabled/via.vhost
sudo rm -f /etc/nginx/sites-enabled/default

sudo service nginx reload
