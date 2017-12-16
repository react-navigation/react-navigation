#!/bin/bash

set -eo pipefail

docker build -t reactcommunity/node-ci:8.4.0-0 -f ./ci.Dockerfile .
docker push reactcommunity/node-ci:8.4.0-0
