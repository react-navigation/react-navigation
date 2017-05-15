/* @flow */

import {
  BackAndroid as OldBackAndroid,
  BackHandler as NewBackAndroid,
  Linking,
} from 'react-native';

const BackHandler = NewBackAndroid || OldBackAndroid;

export { BackHandler, Linking };
