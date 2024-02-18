#!/bin/bash
sudo mkdir /opt/cloud

sudo unzip /tmp/webapp.zip -d /opt/cloud

cd /opt/cloud || exit 

sudo chown csye6225:csye6225 webapp-main -R

cd webapp-main || exit

sudo npm install