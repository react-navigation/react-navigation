import {
  BackAndroid as DeprecatedBackAndroid,
  BackHandler as ModernBackHandler,
} from 'react-native';

const BackHandler = ModernBackHandler || DeprecatedBackAndroid;

export { BackHandler };
