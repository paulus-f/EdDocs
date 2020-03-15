# README

This README would normally document whatever steps are necessary to get the
application up and running.

Things you may want to cover:

* Ruby version

* System dependencies

* Configuration

* Database creation

* Database initialization

* How to run the test suite

* Services (job queues, cache servers, search engines, etc.)

* Deployment instructions

* ...

# STARTUP APP
1) `sudo docker exec -it POSTGRES_CONTAINER bash`
2) `psql -U postgres`
3) `CREATE ROLE rolename LOGIN SUPERUSER PASSWORD 'passwordstring';`      
4) `sudo docker-compose exec app bundle exec rake db:setup db:migrate`

# HELP
`RAILS S` - `docker-compose exec app rails console`