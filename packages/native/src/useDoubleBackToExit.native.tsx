import type {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';
import * as React from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

import type { DoubleBackToExitOptions } from './types';

export function useDoubleBackToExit(
  navigationOrRef?:
    | React.RefObject<NavigationContainerRef<ParamListBase> | null>
    | { canGoBack: () => boolean }
    | null,
  options: DoubleBackToExitOptions = {}
) {
  const {
    message = 'Press back again to exit',
    timeout = 2000,
    showMessage = (msg: string) => {
      if (Platform.OS === 'android') {
        ToastAndroid.show(msg, ToastAndroid.SHORT);
      }
    },
    exitApp = () => {
      BackHandler.exitApp();
    },
    enabled = true,
  } = options;

  const lastBackPressTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!enabled) {
      return;
    }

    if (Platform.OS !== 'android' && process.env.NODE_ENV !== 'test') {
      return;
    }

    const onBackPress = () => {
      const navigation =
        navigationOrRef && 'current' in navigationOrRef
          ? navigationOrRef.current
          : (navigationOrRef as { canGoBack: () => boolean } | undefined);

      if (navigation?.canGoBack()) {
        lastBackPressTimeRef.current = null;
        return false;
      }

      const now = Date.now();

      if (
        lastBackPressTimeRef.current != null &&
        now - lastBackPressTimeRef.current <= timeout
      ) {
        lastBackPressTimeRef.current = null;
        exitApp();
        return true;
      }

      lastBackPressTimeRef.current = now;
      showMessage(message);
      return true;
    };

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress
    );

    return () => {
      subscription.remove();
    };
  }, [navigationOrRef, enabled, message, timeout, showMessage, exitApp]);

  return {
    reset: () => {
      lastBackPressTimeRef.current = null;
    },
  };
}
