#!/bin/bash

set -eo pipefail

case $CIRCLE_NODE_INDEX in 
  0) yarn test && yarn codecov ;; 
  1) yarn link && cd examples/NavigationPlayground && yarn && yarn link react-navigation && yarn test ;; 
  #2) cd examples/ReduxExample && yarn && yarn test ;; 
esac
