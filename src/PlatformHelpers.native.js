/* @flow */

import {
  BackAndroid as DeprecatedBackAndroid,
  BackHandler as ModernBackHandler,
  Linking,
} from 'react-native';
import Config from 'react-native-config';

const BackHandler = ModernBackHandler || DeprecatedBackAndroid;
const isLoggingEnabled = !!Config.REACT_NAV_LOGGING;

export { BackHandler, Linking, isLoggingEnabled };
