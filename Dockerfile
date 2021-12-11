# syntax=docker/dockerfile:1
FROM node:latest
COPY . /app
RUN npm install .
CMD npm run prod
