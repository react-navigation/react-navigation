#!/bin/sh

# abort the script if there is a non-zero error
set -e

# show where we are on the machine
pwd

echo $NOW_JSON_CONTENTS > ~/.now.json

cd website

npm run build

NOW=`pwd`/node_modules/.bin/now

cd build

$NOW --force && sleep 5 && $NOW alias
