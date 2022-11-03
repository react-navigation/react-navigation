#!/usr/bin/env bash

# This bash script prepends a script with the NODE_OPTIONS=--openssl-legacy-provider
# when necesary to avoid the "Error: error:0308010C:digital envelope routines::unsupported" error
# on Node.js 17+.

# TODO: remove this script when Expo migrates to Webpack 5 (and supports Node.js 17+ this way)

node_version=$(node -v)

# We need to remove the "v" from the version string
node_version=${node_version:1}

# We need to take only the first segment of version for example: 17.0.1 -> 17
node_version=${node_version%%.*}

if [ "$node_version" -ge 17 ]; then
    NODE_OPTIONS=--openssl-legacy-provider $@
else
    $@
fi
