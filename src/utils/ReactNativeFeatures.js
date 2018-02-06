import { NativeModules } from 'react-native';
const { PlatformConstants } = NativeModules;

export const supportsImprovedSpringAnimation = () => {
  if (PlatformConstants && PlatformConstants.reactNativeVersion) {
    const { major, minor } = PlatformConstants.reactNativeVersion;
    return minor >= 50 || (major === 0 && minor === 0); // `master` has major + minor set to 0
  }
  return false;
};
