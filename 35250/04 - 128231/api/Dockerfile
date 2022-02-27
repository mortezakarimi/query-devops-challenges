FROM registry.gitlab.com/qio/standard/node:17.3-alpine3.14

WORKDIR /api

ENV NODE_ENV=production

COPY package* ./
RUN npm ci --env=production
COPY . .

ENV PORT=80

EXPOSE ${PORT}
ENTRYPOINT ["npm", "start"]
