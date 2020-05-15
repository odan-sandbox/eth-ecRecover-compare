#!/bin/bash
set -eu

docker-compose up -d

docker-compose logs --follow | grep -m1 "Starting mining operation"
