import { Platform } from 'react-native';
import { getStatusBarHeight as getStatusBarHeightNative } from 'react-native-safe-area-view';

const getStatusBarHeight = Platform.select({
  default: getStatusBarHeightNative,
  web: () => 0,
});

export default getStatusBarHeight;
