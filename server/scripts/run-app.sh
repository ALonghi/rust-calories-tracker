#!/bin/sh

echo "Deleting previous version if it exists"
docker rm $(docker ps -q --filter ancestor=calories-tracker-be )

echo "Building container"
docker build -t calories-tracker-be:latest .

echo "Running container.."
CONTAINER_ID=$(docker run -d --env-file=.env -p 80:80 --name calories-tracker-be calories-tracker-be)

echo "Reading container logs.."
docker logs "$CONTAINER_ID"