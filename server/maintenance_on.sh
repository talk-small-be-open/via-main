#!/bin/bash

sudo ln -s /etc/nginx/sites-available/000_maintenance /etc/nginx/sites-enabled/
sudo service nginx reload
