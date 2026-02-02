/**
 * PlatformColor is not exported in react-native-web.
 * So it results in build errors with Vite.
 * This is a workaround to avoid such errors.
 */
export const PlatformColor:
  | typeof import('react-native').PlatformColor
  | undefined = undefined;

export const DynamicColorIOS:
  | typeof import('react-native').DynamicColorIOS
  | undefined = undefined;
