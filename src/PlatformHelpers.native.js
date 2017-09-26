/* @flow */

import {
  BackAndroid as DeprecatedBackAndroid,
  BackHandler as ModernBackHandler,
  Linking,
} from 'react-native';

const BackHandler = ModernBackHandler || DeprecatedBackAndroid;

export { BackHandler, Linking };
