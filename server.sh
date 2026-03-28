#!/bin/bash

MODE=$1

if [ -z "$MODE" ]; then
    echo "Error: No mode provided. Usage: ./server.sh <dev|prod>"
    exit 1
fi

if [ "$MODE" != "dev" ] && [ "$MODE" != "prod" ]; then
    echo "Error: Invalid mode '$MODE'. Use 'dev' or 'prod'."
    exit 1
fi

echo "================================="
echo " Starting Server in [$MODE] mode"
echo "================================="

cd server

if [ "$MODE" = "dev" ]; then
    npm run start:dev
else
    npm run start
fi
