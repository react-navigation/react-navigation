/* eslint-disable no-restricted-imports */
import * as ReactNative from 'react-native';

type InteractionManagerType = {
  createInteractionHandle(): number;
  clearInteractionHandle(handle: number): void;
};

let InteractionManager: InteractionManagerType | undefined;

try {
  InteractionManager = ReactNative.InteractionManager;
} catch (e) {
  // On newer React Native versions, accessing InteractionManager throws an error
  // https://github.com/react/react-native/pull/57026
}

export { InteractionManager };
