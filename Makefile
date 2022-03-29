install:
	npm i

upgrade-dependencies:
	npx ncu -u

start:
	npx gulp dev

start-production:
	NODE_ENV=production node dist/bin/server.js

build:
	NODE_ENV=production npx gulp build

webpack-bundle:
	NODE_ENV=production npx webpack

webpack-bundle-analyze:
	NODE_ENV=production ANALYZE=true npx webpack

madge: madge-build
	madge --image g.svg dist

madge-build:
	npx gulp buildForMadge

madge-project-structure: madge-build
	npx madge --image project-structure-v?.svg dist/main/index.js dist/client/main/index.js
	rm public/img/project-structure-*
	mv project-structure-v?.svg public/img

madge-depends-on-file:
	madge --exclude '^dist/*' --depends $(arg) .

lint:
	npx tsc
	npx eslint .

lint-ts:
	npx tsc

lint-es:
	npx eslint .

test:
	npx jest --runInBand --watch

test-one-file:
	npx jest --runInBand --watch $(arg)

migrate:
	npx knex migrate:latest

migrate-new:
	npx knex migrate:make $(arg)

migrate-rollback:
	npx knex migrate:rollback

migrate-list:
	npx knex migrate:list

database-build:
	docker build -t dragonfire_database services/database

database-up:
	docker run --rm -d -e POSTGRES_PASSWORD=1 \
	-p 5432:5432 \
	-v dragonfire_database:/var/lib/postgresql/data \
	--name=dragonfire_database \
	dragonfire_database

database-down:
	docker stop dragonfire_database

database-seed:
	npx knex --esm seed:run

database-seed-new:
	npx knex seed:make $(arg)

compose-build:
	docker-compose build

compose-up:
	docker-compose up -d
	docker-compose run app make migrate

compose-down:
	docker-compose down

compose-seed:
	docker-compose run app make database-seed
