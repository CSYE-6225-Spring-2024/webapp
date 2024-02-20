#!/bin/bash
sudo mkdir /opt/webapp

sudo unzip /tmp/webapp.zip -d /opt/webapp

cd /opt/webapp/ || exit 

sudo touch .env
sudo chmod 707 .env

{ echo "DB_NAME=${DB_NAME}"; echo "DB_PWD=${DB_PWD}"; echo "DB_USER=${DB_USER}"; echo "DB_PORT=$((DB_PORT))"; } >> .env

sudo chown csye6225:csye6225 /opt/webapp/ -R

sudo chmod 700 .env
 
sudo npm install