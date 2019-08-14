import * as React from 'react';
import { NavigationHelpers, ParamListBase } from '@navigation-ex/core';
import { BackHandler } from 'react-native';

export default function useBackButton(
  ref: React.RefObject<NavigationHelpers<ParamListBase>>
) {
  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (ref.current == null) {
          return false;
        }

        const navigation = ref.current;

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
