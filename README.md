# Description

SPA app using  react + swr + fastify + objection orm. Traditional blog with ability to add articles, tags and comments. Also have users and authentification

### Features

* Client router. Smooth transitions between pages :fire:
* SSR
* Postgres database
* Nginx in front of Node for caching and serving static content
* One button deploy via Docker
* Requirements: Docker, Git. No need to install Postgres, Nginx. In production server you don't even need Node :blush:

### Cons

* 3x harder frontend, because of need to duplicate database logic. On server side ORM do this work, but on client side we need to code it by hand :cold_sweat:. Fat app.js, fat views. Checkout [this branch](https://github.com/felixcatto/dragonfire/tree/effector). But SWR mitigates complexity from 3x -> 1.33x, which is huge relief :innocent:. Yes, we still need to write 5-10 lines of code in each view, but all this db duplication logic is gone and we get a free cache when moving from page to page.

### Commands

*Development*
```
make database-build # only first time
make database-up
make migrate # only first time, create database structure
make database-seed # only first time, for prepopulate database
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
