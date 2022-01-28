#!/usr/bin/env node

/* eslint-disable import/no-commonjs */

const path = require('path');
const fs = require('fs');

/**
 * react-native-gesture-handler currently doesn't work with monorepo
 */
const buildGradlePath = path.join(
  __dirname,
  '..',
  'node_modules',
  'react-native-gesture-handler',
  'android',
  'build.gradle'
);

let buildGradleContent = fs.readFileSync(buildGradlePath, 'utf8');

buildGradleContent = buildGradleContent.replace(
  "'../node_modules/react-native-reanimated/package.json'",
  "'../../node_modules/react-native-reanimated/package.json'"
);

fs.writeFileSync(buildGradlePath, buildGradleContent);
