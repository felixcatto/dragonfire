# Description

SPA app using  react + effector + fastify + objection orm. Traditional blog with ability to add articles, tags and comments. Also have users and authentification

### Features

* Client router. Smooth transitions between pages :fire:
* SSR
* Postgres database
* Nginx in front of Node for caching and serving static content
* One button deploy via Docker
* Requirements: Docker, Git. No need to install Postgres, Nginx. In production server you don't even need Node :blush:

### Cons

* 3x harder frontend, because of need to duplicate database logic. On server side ORM do this work, but on client side we need to code it by hand :cold_sweat:. Fat app.js, fat views

### Commands

*Development*
```
make database-build # only first time
make database-up 
make database-seed # for prepopulate database, only first time
make start
```

*Deploy*
```
git clone https://github.com/felixcatto/dragonfire.git
cd dragonfire
make compose-build
make compose-up
make compose-seed # for prepopulate database, only first time
```
then go to `http://localhost/`
