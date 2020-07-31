import * as Updates from 'expo-updates';

export function restartApp() {
  Updates.reloadAsync();
}
