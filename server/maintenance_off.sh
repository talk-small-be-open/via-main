#!/bin/bash

sudo rm -f /etc/nginx/sites-enabled/000_maintenance
sudo ln -fs /etc/nginx/sites-available/via.vhost /etc/nginx/sites-enabled/
sudo ln -fs /etc/nginx/sites-available/default /etc/nginx/sites-enabled/

sudo service nginx reload
