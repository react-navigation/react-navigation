#!/bin/sh

# abort the script if there is a non-zero error
set -e

# show where we are on the machine
pwd

cd website

npm run build

cd build

docker login -e $HEROKU_LOGIN -u $HEROKU_LOGIN -p $HEROKU_API_KEY registry.heroku.com
docker build . -t registry.heroku.com/react-navigation/web
docker push registry.heroku.com/react-navigation/web
