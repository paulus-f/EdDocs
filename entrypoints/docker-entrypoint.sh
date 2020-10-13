#!/bin/sh

set -e

#until nc -z -v -w30 $POSTGRES_HOST $POSTGRES_PORT; do
# echo 'Waiting for POSTGRES...'
# sleep 1
#done

echo "POSTGRES is up and running!"

if bundle exec rake db:migrate 2>/dev/null; then
  echo "POSTGRES migrated"
else
  bundle exec rake db:create db:migrate
  bundle exec rake db:seed
  echo "POSTGRES database has been created & migrated!"
fi

if [ -f tmp/pids/server.pid ]; then
  rm tmp/pids/server.pid
fi

bundle exec rails s -b 0.0.0.0
