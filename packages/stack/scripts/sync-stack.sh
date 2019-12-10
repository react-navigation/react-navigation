#!/bin/bash

set -euxo pipefail

rm -rf src/vendor
mkdir -p src/vendor
cp -r node_modules/@react-navigation/stack/src/* src/vendor/

# Created with: diff -ruN node_modules/@react-navigation/stack/src src/vendor > scripts/stack.patch
patch -p0 -i scripts/stack.patch
