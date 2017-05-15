/* @flow */

import {
  BackAndroid as OldBackAndroid,
  BackHandler as NewBackAndroid,
  Linking,
} from 'react-native';

let BackHandler = NewBackAndroid || OldBackAndroid;

export { BackHandler, Linking };
