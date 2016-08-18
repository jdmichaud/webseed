# vim:set ft=dockerfile:
FROM ubuntu:wily

MAINTAINER novidee

# Retrieve build-time arguments
ARG ENVIRONMENT

# Set the application name
ENV APPLICATION webseed

# explicitly set user/group IDs
#RUN groupadd -r jedi --gid=999 && useradd -r -g jedi --uid=999 jedi
RUN useradd -ms /bin/bash jedi
RUN chown -R jedi:jedi /home/jedi/

#
# Python dependencies
#

USER root
# Install ubuntu dependencies for pip packages
RUN apt-get update
RUN apt-get install -y software-properties-common
RUN apt-get install -y build-essential git
RUN apt-get install -y python python-dev python-setuptools
RUN apt-get install -y lsb-release
# A few utilisy for debugging purposes
RUN apt-get install -y nano
RUN apt-get install -y lsof
RUN apt-get install -y net-tools
RUN apt-get install -y inetutils-ping
RUN apt-get install -y tmux
RUN apt-get install -y vim
RUN apt-get install -y curl
# This is for postgres
RUN apt-get install -y libpq-dev
# to avoid urllib warning, we need pyopenssl which needs libssl-dev + libffi-dev
RUN apt-get install -y libffi-dev
RUN apt-get install -y libssl-dev
# For Pillow
RUN apt-get install -y libjpeg8-dev zlib1g-dev

# Install pip packages
RUN easy_install pip

# install some modules outside the requirements file we only need in the docker, not in the dev env
RUN pip install uwsgi
# Postgres python driver
RUN pip install psycopg2==2.6.1
# For urllib warning
RUN pip install pyopenssl ndg-httpsclient pyasn1


#
# Django application
#

# Switch to root here because copying a folder with unknown user make them
# unaccesible to the container user
USER root
# install our code
COPY . /home/jedi/site/
RUN chown -R jedi:jedi /home/jedi/
# Use the jedi user
USER jedi
# Clean up the target
RUN find /home/jedi/site/ -name '*.pyc' | xargs rm -fr
# Use the ENVIRONMENT settings for now
RUN rm -fr /home/jedi/site/backend/$APPLICATION/settings/settings.py
RUN ln -s /home/jedi/site/backend/$APPLICATION/settings/settings_${ENVIRONMENT}.py /home/jedi/site/backend/$APPLICATION/settings/settings.py
# Install pip requirenments
USER root
RUN pip install -r /home/jedi/site/backend/infra/conf/requirements.txt


#
# nginx
#
USER root


# For explanation of the deamon off: http://stackoverflow.com/questions/18861300/how-to-run-nginx-within-a-docker-container-without-halting
# install nginx
RUN apt-get update
RUN add-apt-repository -y ppa:nginx/stable
RUN apt-get install -y nginx

#RUN echo "daemon off;" >> /etc/nginx/nginx.conf
# configure the logs to output to the host log volume
RUN sed -r -i "s:access_log /var/log/nginx/access.log:access_log /home/jedi/logs/nginx/access.log:g" /etc/nginx/nginx.conf
RUN sed -r -i "s:error_log /var/log/nginx/error.log:error_log /home/jedi/logs/nginx/error.log:g" /etc/nginx/nginx.conf
# remove default site
RUN rm -fr /etc/nginx/sites-enabled/default
# link to application site
RUN ln -s /home/jedi/site/backend/infra/conf/nginx.conf /etc/nginx/sites-enabled/${APPLICATION}.conf
# Add nginx user (www-data) to jedi group to read uwsgi socket in /tmp/${APPLICATION}.socket
# Now why add both user to both groups? Beats me.
RUN usermod -a -G www-data jedi
RUN usermod -a -G jedi www-data
# Expose the nginx port
EXPOSE 80


#
# Postgres
#
USER root

# Everything related to postgres is inspired by the official postgres docker image
# https://github.com/docker-library/postgres

# grab gosu for easy step-down from root
RUN gpg --keyserver ha.pool.sks-keyservers.net --recv-keys B42F6819007F00F88E364FD4036A9C25BF357DD4
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates wget && rm -rf /var/lib/apt/lists/* \
	&& wget -O /usr/local/bin/gosu "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture)" \
	&& wget -O /usr/local/bin/gosu.asc "https://github.com/tianon/gosu/releases/download/1.2/gosu-$(dpkg --print-architecture).asc" \
	&& gpg --verify /usr/local/bin/gosu.asc \
	&& rm /usr/local/bin/gosu.asc \
	&& chmod +x /usr/local/bin/gosu

# make the "fr_FR.UTF-8" locale so postgres will be french utf-8 enabled by default
#RUN apt-get update && apt-get install -y locales && rm -rf /var/lib/apt/lists/* \
#	&& localedef -i fr_FR -c -f UTF-8 -A /usr/share/locale/locale.alias fr_FR.UTF-8
#ENV LANG fr_FR.utf8

# We won't use this, Postgres version will depend on the ubuntu version. We
# wan't to be able to upgrade ubuntu version anytime. As long as we stick to
# 9.4 we should not have stability issues.
ENV PG_MAJOR 9.4
ENV PG_VERSION 9.4.6-1.pgdg80+1

RUN echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -sc)-pgdg main" $PG_MAJOR > /etc/apt/sources.list.d/pgdg.list
# Add the postgres key so apt don't complain
RUN wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add - && \
	apt-get update

# First install postgres-common and change createcluster.conf to disable the
# creation of the cluster on the installation of the postgres package.
# The cluster will be created manually later once we have configured PGDATA
RUN apt-get update \
	&& apt-get install -y postgresql-common \
	&& sed -ri 's/#(create_main_cluster) .*$/\1 = false/' /etc/postgresql-common/createcluster.conf \
	&& apt-get install -y \
		postgresql-$PG_MAJOR \
		postgresql-contrib-$PG_MAJOR \
#		postgresql-$PG_MAJOR=$PG_VERSION \
#		postgresql-contrib-$PG_MAJOR=$PG_VERSION \
	&& rm -rf /var/lib/apt/lists/*

# Not sure to understand what is this for. Apparently, unix socket for postgres
# are created in this folder. So create it and give ownership to jedi user
RUN mkdir -p /var/run/postgresql && chown -R jedi /var/run/postgresql
# To access initdb
ENV PATH /usr/lib/postgresql/$PG_MAJOR/bin:$PATH

# /!\ Here we define the database location in the variable environement
# override this with
# Let's not defined thie varenv here. User HAS to specify in the command line.
#ENV PGDATA /var/lib/postgresql/data

# Why would we use a volume here?
#VOLUME /var/lib/postgresql/data

EXPOSE 5432

#
# Set the cronjobs
#
USER jedi
RUN echo "00 00 * * 2 python site/backend/manage.py send_aggregation --cron" >> /tmp/cronfile
#install new cron file
RUN crontab /tmp/cronfile
RUN rm /tmp/cronfile

#
# End of script
#

USER root

# When doing `docker exec`, even with -t option, the TERM variable is not set
# So force it into the bash so we can do stuff when we exec into a container
RUN echo "export TERM=xterm" >> /etc/bash.bashrc

# Clean up APT when done.
#RUN apt-get purge -y --auto-remove ca-certificates wget
#RUN apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# need to understand what supervisor does
#RUN apt-get install -y supervisor
#RUN ln -s /home/jedi/site/infra/supervisor-app.conf /etc/supervisor/conf.d/
#cmd ["supervisord", "-n"]

# This script will be executed on docker-run.
# It checks if the database exists, and if it does not, it creates it.
ENTRYPOINT ["/home/jedi/site/backend/infra/scripts/init-container.sh"]
