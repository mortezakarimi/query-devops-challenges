FROM registry.gitlab.com/qio/standard/composer:2,2

WORKDIR /api

COPY . .
RUN composer install

ENTRYPOINT ["/bin/sh", "/api/runner.sh"]
