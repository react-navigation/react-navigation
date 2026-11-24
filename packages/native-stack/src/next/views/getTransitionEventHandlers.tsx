import type { NativeStackNavigationHelpers } from '../../types';

export function getTransitionEventHandlers(
  navigation: NativeStackNavigationHelpers,
  key: string
) {
  return {
    onWillAppear: () => {
      navigation.emit({
        type: 'transitionStart',
        data: { closing: false },
        target: key,
      });
    },
    onDidAppear: () => {
      navigation.emit({
        type: 'transitionEnd',
        data: { closing: false },
        target: key,
      });
    },
    onWillDisappear: () => {
      navigation.emit({
        type: 'transitionStart',
        data: { closing: true },
        target: key,
      });
    },
    onDidDisappear: () => {
      navigation.emit({
        type: 'transitionEnd',
        data: { closing: true },
        target: key,
      });
    },
  };
}
