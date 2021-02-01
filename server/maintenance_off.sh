#!/bin/bash

sudo rm -f /etc/nginx/sites-enabled/000_maintenance
sudo ln -s /etc/nginx/sites-available/via.vhost /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

sudo service nginx reload
