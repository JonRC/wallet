#!/bin/bash

docker compose up account-postgres

docker build -t account-migration -f Dockerfile.migration account-server
docker run account-migration

docker compose down


