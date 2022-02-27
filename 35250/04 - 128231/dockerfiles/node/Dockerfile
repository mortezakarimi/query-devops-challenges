FROM registry.gitlab.com/qio/standard/node:17.3-alpine3.14

WORKDIR /api

COPY . .
RUN npm i

ENTRYPOINT ["/bin/sh", "/api/runner.sh"]
