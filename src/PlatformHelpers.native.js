/* @flow */

import {
  BackAndroid as DeprecatedBackAndroid,
  BackHandler,
  Linking,
} from 'react-native';

const BackAndroid = BackHandler || DeprecatedBackAndroid;

export { BackAndroid, Linking };
