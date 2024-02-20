#!/bin/bash

sudo postgresql-setup --initdb

sudo sed -i 's/host    all             all             127.0.0.1\/32            ident/host    all             all             127.0.0.1\/32            scram-sha-256/g' /var/lib/pgsql/data/pg_hba.conf
sudo sed -i 's/host    all             all             ::1\/128                 ident/host    all             all             ::1\/128                 scram-sha-256/g' /var/lib/pgsql/data/pg_hba.conf

sudo systemctl start postgresql
sudo systemctl enable postgresql

sudo -u postgres psql -c "CREATE USER anirban WITH PASSWORD 'cloud_2024';"
sudo -u postgres psql -c "CREATE DATABASE cloud_db WITH OWNER anirban;"
