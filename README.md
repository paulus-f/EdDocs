# DEVELOPMENT .ENV
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_PORT=5432
POSTGRES_HOST=database
REDIS_URL=redis://redis:6379/0

# HELP
`db role` - `CREATE ROLE rolename LOGIN SUPERUSER PASSWORD 'passwordstring';`
`docker build` - `docker-compose build`
`run app` - `docker-compose up`
`RAILS S` - `docker-compose exec app rails console`
`DB SETUP` - `docker-compose exec app bundle exec rake db:setup db:migrate`