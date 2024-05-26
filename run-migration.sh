#!/bin/bash

docker compose up account-postgres -d

docker build -t account-migration -f account-server/migration.Dockerfile account-server
docker run --network host account-migration

# docker compose down


