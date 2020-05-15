#!/bin/bash
set -eu

docker-compose up -d

docker-compose logs | grep -m1 "Starting mining operation"
