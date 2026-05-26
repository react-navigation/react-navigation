export const createNativeBottomTabNavigator: typeof import('./createNativeBottomTabNavigator.native').createNativeBottomTabNavigator =
  () => {
    throw new Error('Native Bottom Tabs are not supported on this platform.');
  };

export const createNativeBottomTabScreen: typeof import('./createNativeBottomTabNavigator.native').createNativeBottomTabScreen =
  () => {
    throw new Error('Native Bottom Tabs are not supported on this platform.');
  };

export type NativeBottomTabTypeBag =
  import('./createNativeBottomTabNavigator.native').NativeBottomTabTypeBag;
