import * as React from 'react';
import { BackHandler } from 'react-native';
import type { NavigationContainerRef } from '@react-navigation/core';

export default function useBackButton(
  ref: React.RefObject<NavigationContainerRef>
) {
  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        const navigation = ref.current;

        if (navigation == null) {
          return false;
        }

        if (navigation.canGoBack()) {
          navigation.goBack();

          return true;
        }

        return false;
      }
    );

    return () => subscription.remove();
  }, [ref]);
}
