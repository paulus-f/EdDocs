FROM ruby:2.5.1

ENV BUNDLER_VERSION=2.0.2

RUN apt-get update && apt-get install -y nodejs \
      postgresql-client \
      curl \
      build-essential \
      libpq-dev &&\
      curl -sL https://deb.nodesource.com/setup_10.x | bash - && \
      curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add - && \
      echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list && \
      apt-get update && apt-get install -y nodejs yarn

RUN mkdir /app
WORKDIR /app

COPY Gemfile /app/Gemfile
COPY Gemfile.lock /app/Gemfile.lock

RUN gem install bundler -v 2.0.2
RUN bundle check || bundle install 

COPY . /app
#-v 2.0.2

#COPY package.json yarn.lock ./

RUN yarn install --check-files

COPY ./entrypoints/docker-entrypoint.sh /
RUN chmod +x ./entrypoints/docker-entrypoint.sh

ENTRYPOINT ["./entrypoints/docker-entrypoint.sh"]
