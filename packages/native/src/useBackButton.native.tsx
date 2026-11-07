import type {
  NavigationContainerRef,
  ParamListBase,
} from '@react-navigation/core';
import * as React from 'react';
import { BackHandler, Platform, ToastAndroid } from 'react-native';

import type { DoubleBackToExitOptions } from './types';

export function useBackButton(
  ref: React.RefObject<NavigationContainerRef<ParamListBase> | null>,
  doubleBackToExit?: boolean | DoubleBackToExitOptions
) {
  const lastBackPressTimeRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const navigation = ref.current;

        if (navigation == null) {
          return false;
        }

        if (navigation.canGoBack()) {
          lastBackPressTimeRef.current = null;
          navigation.goBack();

          return true;
        }

        if (doubleBackToExit) {
          const config =
            typeof doubleBackToExit === 'object' ? doubleBackToExit : {};
          const enabled = config.enabled !== false;

          if (enabled) {
            const timeout = config.timeout ?? 2000;
            const message = config.message ?? 'Press back again to exit';
            const showMessage =
              config.showMessage ??
              ((msg: string) => {
                if (Platform.OS === 'android') {
                  ToastAndroid.show(msg, ToastAndroid.SHORT);
                }
              });
            const exitApp =
              config.exitApp ??
              (() => {
                BackHandler.exitApp();
              });

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
          }
        }

        return false;
      }
    );

    return () => subscription.remove();
  }, [ref, doubleBackToExit]);
}
