.PHONY: build up down shell-php shell-frontend install seed create-api create-frontend console logs

## Buildnout PHP image
build:
	docker compose build --no-cache

## Spustit vše
up:
	docker compose up -d

## Zastavit vše
down:
	docker compose down

## Shell do PHP kontejneru
shell-php:
	docker compose exec php bash

## Shell do Next.js kontejneru
shell-frontend:
	docker compose exec frontend sh


## Nahrát seed data do databáze
seed:
	docker compose exec -T db mysql -u yeti -pyeti yetinder < db/seed.sql

## Nainstalovat závislosti (po git clone)
install:
	docker compose exec php composer install
	docker compose exec frontend npm install

## Symfony console zkratka (použití: make console CMD="cache:clear")
console:
	docker compose exec php php bin/console $(CMD)

## Logy
logs:
	docker compose logs -f

logs-php:
	docker compose logs -f php

logs-frontend:
	docker compose logs -f frontend
