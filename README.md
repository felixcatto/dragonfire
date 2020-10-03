# Description

SPA app using fastify + react + objection orm

### Features

* Client router
* SSR
* Postgres database
* Nginx in front of Node for serving static content
* One button deploy via Docker
* Requirements: Docker, Git. No need to install Postgres, Nginx. In production server you don't even need Node :blush:

### Commands

*Development*
```
make database-up
make start
```

*Deploy*
```
git clone https://github.com/felixcatto/dragonfire.git
cd dragonfire
make compose-build
make compose-up
make compose-seed # for prepopulate database, can be skipped
```
then go to `http://localhost/`
