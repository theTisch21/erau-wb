#!/usr/bin/env bash
set -e

git pull origin main
yarn install --immutable
yarn build
pm2 startOrRestart ecosystem.config.cjs
