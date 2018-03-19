#!/bin/bash

set -eo pipefail

case $CIRCLE_NODE_INDEX in 
  0) yarn test && yarn codecov ;; 
  1) cd examples/NavigationPlayground && yarn && yarn test ;; 
  #2) cd examples/ReduxExample && yarn && yarn test ;; 
esac
