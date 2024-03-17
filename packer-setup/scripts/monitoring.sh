#!/bin/bash

sudo mkdir -p /var/log/webapp/

sudo touch /var/log/webapp/webapp.log

sudo chown csye6225:csye6225 /var/log/webapp/ -R

sudo curl -sSO https://dl.google.com/cloudagents/add-google-cloud-ops-agent-repo.sh

sudo bash add-google-cloud-ops-agent-repo.sh --also-install

sudo cp /tmp/config.yaml /etc/google-cloud-ops-agent/config.yaml

sudo systemctl restart google-cloud-ops-agent