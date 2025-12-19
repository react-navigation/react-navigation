import { useWindowDimensions } from 'react-native';

import { NativeReactNavigation } from './native-module/NativeReactNavigation';

export function isFullScreen() {
  return NativeReactNavigation?.isFullScreen() ?? true;
}

export function useIsFullScreen() {
  // Ensure re-render on dimension changes
  useWindowDimensions();
  return isFullScreen();
}
