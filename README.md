# webseed

A seed project for web development

## Docker related commands

### Make a production ready tarball
```
make dist
```

### Build an image

```
docker build --build-arg ENVIRONMENT=STAGING  -t webseed .
```

### Run an image

#### Staging

```
docker run -d --name webseed_staging \
              --restart=unless-stopped \
              -v /home/jedi/db/webseed_staging:/home/jedi/db \
              -v /home/jedi/logs/webseed_staging:/home/jedi/logs \
              -e PGDATA=/home/jedi/db \
              -e POSTGRES_DB=webseed_staging \
              -e DBPASSWD=XXXXXXX \
              -p 8080:80 \
              webseed
```

#### Prod

```
docker run -d --name webseed \
              --restart=unless-stopped \
              -v /home/jedi/db/webseed:/home/jedi/db \
              -v /home/jedi/logs/webseed:/home/jedi/logs \
              -e PGDATA=/home/jedi/db \
              -e POSTGRES_DB=webseed \
              -e DBPASSWD=XXXXXXX \
              -p 8081:80 \
              webseed
```

### Attach a terminal

```
docker exec -it webseed_staging bash
```

### Save docker image
```
docker save -o /tmp/webseed.tar webseed
```

### Load docker image
```
docker load -i webseed.tar
```
### TODO

Add app.css with minification

