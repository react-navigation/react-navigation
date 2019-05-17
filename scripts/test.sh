#!/bin/bash

set -eo pipefail

case $CIRCLE_NODE_INDEX in
  0) yarn test && yarn codecov ;;
esac
