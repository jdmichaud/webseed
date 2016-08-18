#!/bin/bash

# Inspired by the official postgres docker image
# https://github.com/docker-library/postgres

# Script fails on first error
set -e

# Create logs directories
mkdir -p /home/jedi/logs/nginx/
# Point the postgres logs to the host folder
ln -sf /home/jedi/db/pg_log /home/jedi/logs/postgres
# Setting the proper rights on the logs directory
chown -R jedi:jedi "/home/jedi/logs/"

# Check the postgres database exist at the $PGDATA location
# If the database does not exist, create it.
# To check if the DB exist, we check the file PG_VERSION exists and is not
# empty. This file is a simple text file created by initdb.
if [ ! -s "$PGDATA/PG_VERSION" ]; then
  echo "DB does not exist. Create it."
  mkdir -p "$PGDATA"
  # Fix access rights
  chmod 700 "$PGDATA"
  chown -R jedi:jedi "$PGDATA"
  # What is this for ? Useless ?
  #chmod g+s /run/postgresql
  #chown -R jedi /run/postgresql

  # Init the DB
  echo "InitDB"
  gosu jedi initdb

  # Allow access to all with password
  echo "Setting user access to peer..."
  sed -r -i.orig 's/(local\s+all\s+all\s+)\w+/\1trust/g' "$PGDATA/pg_hba.conf"
  echo "Setting localhost access to md5..."
  sed -r -i.bkp 's/(host\s+all\s+127.0.0.1:32\s+)\w+/\1md5/g' "$PGDATA/pg_hba.conf"

  # Activate the logs
  sed -r -i "s:#(log_directory = .*):\1:g" "$PGDATA/postgresql.conf"
  sed -r -i "s:#(log_filename = .*):\1:g" "$PGDATA/postgresql.conf"
  sed -r -i "s:#(log_rotation_size = .*):\1:g" "$PGDATA/postgresql.conf"

  # internal start of server in order to allow set-up using psql-client
  # does not listen on TCP/IP (-o) and waits until start finishes (-w)
  echo "Start postgres server..."
  # For some reason, the "-c listen_addresses=''" stick around even after we restart
  # without the option. Anyway, not really useful, there would be only few seconds
  # at the creation of the DB for a vulnerability to appear... Very very unlikely.
  #gosu jedi pg_ctl -D "$PGDATA" -o "-c listen_addresses=''" -w start
  gosu jedi pg_ctl -D "$PGDATA" -w start

  # Create the DB
  # $POSTGRES_DB is the DB name and depends on the site. It shall be provided
  # to the docker-run command using the -e option
  # (e.g. docker run -e POSTGRES_DB=pes_staging)
  echo "Create user db for jedi"
  gosu jedi createdb
  echo "Create the database $POSTGRES_DB"
  psql --username jedi <<- EOSQL
  	  CREATE DATABASE "$POSTGRES_DB" ;
EOSQL

  # Create the DB user
  echo "Create the user and grant access"
  psql --username jedi <<- EOSQL
	  ALTER USER jedi WITH SUPERUSER PASSWORD '$DBPASSWD' ;
EOSQL

  # Listen only to localhost. The server code is running in the same container.
  # For this set the field "listen_addresses" to "localhost" in postgresql.conf
  echo "Allow access to postgres to localhost"
  sed -ri "s/^#?(listen_addresses\s*=\s*)\S+/\1localhost/" "$PGDATA/postgresql.conf"

  # Restart the server
  echo "Restart the server ..."
  gosu jedi pg_ctl -D "$PGDATA" -m fast -w restart

  # Set propser access right to application logs
  chown -R jedi:jedi "/home/jedi/logs/"

  # Initiate django migration
  gosu jedi python /home/jedi/site/backend/manage.py migrate

  # Create a supser user
  herescript=`mktemp`
  gosu jedi cat << EOP > $herescript
from django.contrib.auth import get_user_model
User = get_user_model()
User.objects.create_superuser('novidee.mail@gmail.com', '$DBPASSWD')
EOP
  python /home/jedi/site/backend/manage.py shell << EOF
execfile('$herescript')
EOF
  rm -fr $herescript

  # Configure site in DB
  herescript=`mktemp`
  gosu jedi cat << EOP > $herescript
from django.conf import settings
from django.contrib.sites.models import Site
site = Site.objects.get(id=settings.SITE_ID)
site.domain = settings.ALLOWED_HOSTS[0]
site.save()
EOP
  python /home/jedi/site/backend/manage.py shell << EOF
execfile('$herescript')
EOF
  rm -fr $herescript

fi # Creation of the postgres DB


# Collect static for the site. Might take a few seconds
(export HOME=/home/jedi && yes yes | gosu jedi python /home/jedi/site/backend/manage.py collectstatic)
# Restart web server
service nginx restart
# Restart sql server
gosu jedi pg_ctl -D "$PGDATA" -m fast -w restart
# launch uwsgi
gosu jedi uwsgi --ini /home/jedi/site/backend/infra/conf/uwsgi-pes.ini
