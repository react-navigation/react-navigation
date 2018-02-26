import {
  BackAndroid as DeprecatedBackAndroid,
  BackHandler as ModernBackHandler,
  MaskedViewIOS,
} from 'react-native';

const BackHandler = ModernBackHandler || DeprecatedBackAndroid;

export { BackHandler, MaskedViewIOS };
