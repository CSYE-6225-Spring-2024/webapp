#!/bin/bash

sudo cp /tmp/csye6225.service /etc/systemd/system/
 
sudo systemctl daemon-reload 

sudo systemctl start csye6225
sudo systemctl enable csye6225.service

sleep 5m