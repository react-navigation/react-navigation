import { useWindowDimensions } from 'react-native';

import { IsFullScreen as IsFullScreenModule } from './is-full-screen/src/NativeIsFullScreen';

export function isFullScreen() {
  return IsFullScreenModule.isFullScreen();
}

export function useIsFullScreen() {
  // Ensure re-render on dimension changes
  useWindowDimensions();
  return isFullScreen();
}
