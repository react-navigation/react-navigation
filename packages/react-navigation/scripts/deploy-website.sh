#!/bin/sh

# abort the script if there is a non-zero error
set -e

# show where we are on the machine
pwd

cd website

npm run build

NOW=`pwd`/node_modules/.bin/now

cd build

$NOW -t $NOW_TOKEN --force && sleep 5 && $NOW -t $NOW_TOKEN alias
