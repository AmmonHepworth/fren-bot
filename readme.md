# GAS Chat Fren Bot

[![Linter](https://github.com/AmmonHepworth/fren-bot/actions/workflows/lint.yml/badge.svg)](https://github.com/AmmonHepworth/fren-bot/actions/workflows/lint.yml)

This is the back-end for the GAS chat Telegram/Discord bot.

---

### Setup

Clone down this project and `cd` into the directory. If you are using the [asdf version manager](https://asdf-vm.com/#/) with the `asdf-nodejs` plugin, just run `asdf install` to ensure you have the right version of `node`. Then, just run `npm i` to install dependencies.

To run the project, run `npm run dev` to start the project in a development environment and `npm run prod` to start the project in a production environment.

### Configuration

The default configuration for this project is stored in `.env.development` and `.env.production`. If you need to override the defaults, do not edit these files directly as they are checked into Git. Rather, create your own `.env.development.local` and `.env.production.local` and set any values you need to override in those.

The appropriate configuration will be used when running the server.

### Docker

To run fren-bot in docker:

- clone this repo
- add your tokens to .env.production.local
- run the following commands:

```
docker-compose build
docker-compose up
```

### Linting

This project inherits from Airbnb's lint rules. You may customize the lint rules by modifying `.eslintrc.js`. If you disable a rule, consider leaving a comment rationalizing why you removed it from the project.

To run the linter, just run `npm run lint`.
