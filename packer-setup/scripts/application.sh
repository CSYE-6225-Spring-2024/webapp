#!/bin/bash
sudo mkdir /opt/webapp

sudo unzip /tmp/webapp.zip -d /opt/webapp

sudo chown csye6225:csye6225 /opt/webapp -R

cd /opt/webapp || exit 

sudo npm install