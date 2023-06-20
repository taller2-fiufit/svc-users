FROM node:18.16.0-alpine3.18 AS development

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

FROM node:18.16.0-alpine3.18 AS production

ARG NODE_ENV=production

ENV NODE_ENV=${NODE_ENV}

WORKDIR /usr/src/app

COPY package*.json ./

COPY yarn.lock ./

RUN yarn install --production=true

COPY . .

COPY --from=development /usr/src/app/dist ./dist

CMD ["yarn", "run", "start:prod"]
