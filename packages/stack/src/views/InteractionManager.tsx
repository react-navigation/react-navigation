/* eslint-disable no-restricted-imports */
import * as ReactNative from 'react-native';

type InteractionManagerType = {
  createInteractionHandle(): number;
  clearInteractionHandle(handle: number): void;
};

let InteractionManager: InteractionManagerType | undefined;

const version = ReactNative.Platform.constants?.reactNativeVersion;

try {
  InteractionManager =
    version?.major === 0 && version.minor >= 82
      ? undefined
      : ReactNative.InteractionManager;
} catch (e) {
  // On newer React Native versions, accessing InteractionManager throws an error
  // https://github.com/react/react-native/pull/57026
}

export { InteractionManager };
