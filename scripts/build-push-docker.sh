#!/bin/bash

set -eo pipefail

docker build -t reactcommunity/node-ci:7.10.0-1 -f ./ci.Dockerfile .
docker push reactcommunity/node-ci:7.10.0-1
