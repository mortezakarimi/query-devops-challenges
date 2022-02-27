FROM registry.gitlab.com/qio/standard/golang:1.17

WORKDIR /api

COPY . .
RUN go mod tidy

ENTRYPOINT ["/bin/sh", "/api/runner.sh"]
