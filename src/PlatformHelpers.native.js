/* @flow */

/* @flow */

import {
  BackAndroid as OldBackAndroid,
  BackHandler as NewBackAndroid,
  Linking,
} from 'react-native';

const fullVersion = require('react-native/package.json').version.split('.')[1];

let BackHandler = fullVersion < 44 ? OldBackAndroid : NewBackAndroid;

export { BackHandler, Linking };
