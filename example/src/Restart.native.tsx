import { Updates } from 'expo';
import RNRestart from 'react-native-restart';

export function restartApp() {
  // @ts-expect-error: Expo doesn't exist in global definitions
  if (global.Expo) {
    Updates.reloadFromCache();
  } else {
    RNRestart.Restart();
  }
}
