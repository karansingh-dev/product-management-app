#!/bin/bash

MODE=$1

if [ -z "$MODE" ]; then
    echo "Error: No mode provided. Usage: ./client.sh <dev|prod>"
    exit 1
fi

if [ "$MODE" != "dev" ] && [ "$MODE" != "prod" ]; then
    echo "Error: Invalid mode '$MODE'. Use 'dev' or 'prod'."
    exit 1
fi

echo "================================="
echo " Starting Client in [$MODE] mode"
echo "================================="

cd client

if [ "$MODE" = "dev" ]; then
    npm run dev
else
    npm run build && npm run preview
fi
