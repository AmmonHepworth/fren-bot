# syntax=docker/dockerfile:1
FROM node:17-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production

COPY . .

CMD [ "npm", "run", "prod" ]
