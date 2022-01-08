# syntax=docker/dockerfile:1
FROM node:17-alpine
COPY . /app

WORKDIR /app

RUN npm install .
CMD npm run prod