# DEVELOPMENT .ENV

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
POSTGRES_HOST=database
REDIS_URL=redis://redis:6379/0
COMPOSE_PROJECT_NAME=edDoc
EMAIL_USER=username
EMAIL_PASSWORD=password
EMAIL_DOMAIN=example.com
EMAIL_ADDRESS=smpt.smth
EMAIL_PORT=25
SECRET_KEY_BASE=SECRET_KEY
```

# HELP

`db role` - `CREATE ROLE rolename LOGIN SUPERUSER PASSWORD 'passwordstring';`

`docker build` - `docker-compose build`

`run app` - `docker-compose up -d`

`RAILS S` - `docker-compose exec app rails console`

`DB SETUP` - `docker-compose exec app bundle exec rake db:setup db:migrate`

`webpack` - `sudo docker-compose exec app bin/webpack-dev-server`

`attach container for debug` - `sudo docker attach $(sudo docker-compose ps -q app)`

# CANVAS FOR CHAARTS LIB
```
/app/javascript/components/AdminDashboard/jquery.canvasjs.min.js
/app/javascript/components/AdminDashboard/canvasjs.min.js
```
Link - https://canvasjs.com/docs/charts/integration/react/

# CSV EXAMPLE

Link - https://github.com/PFdev6/EdDocs/blob/master/csv_example.csvC
