#!/bin/bash
sudo mkdir /opt/webapp

sudo unzip /tmp/webapp.zip -d /opt/webapp

cd /opt/webapp/ || exit 

sudo tee -a .env <<EOF >/dev/null
DB_NAME=${DB_NAME}
DB_PWD=${DB_PWD}
DB_USER=${DB_USER}
DB_PORT=$((DB_PORT))
EOF

sudo chown csye6225:csye6225 /opt/webapp/ -R
 
sudo npm install