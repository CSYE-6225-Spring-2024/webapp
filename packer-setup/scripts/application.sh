#!/bin/bash
sudo mkdir /opt/webapp

sudo unzip /tmp/webapp.zip -d /opt/webapp

cd /opt/webapp/ || exit 

sudo chown csye6225:csye6225 /opt/webapp/ -R
 
sudo npm install