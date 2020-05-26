import RNRestart from 'react-native-restart';
import { Updates } from 'expo';

export function restartApp() {
  // @ts-ignore
  if (global.Expo) {
    Updates.reloadFromCache();
  } else {
    RNRestart.Restart();
  }
}
