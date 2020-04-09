import * as React from 'react';
import {
  useNavigation,
  useRoute,
  EventArg,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/core';

interface CallbackArguments {
  tabPressEvent: EventArg<'tabPress', true>;
  currentNavigation: NavigationProp<ParamListBase>;
}

export default function useTabPress(
  callback: (callbackArguments: CallbackArguments) => void | undefined
) {
  const navigation = useNavigation();
  const route = useRoute();

  React.useEffect(() => {
    let current = navigation;

    // The screen might be inside another navigator such as stack nested in tabs
    // We need to find the closest tab navigator and add the listener there
    while (current && current.dangerouslyGetState().type !== 'tab') {
      current = current.dangerouslyGetParent();
    }

    if (!current) {
      return;
    }

    const unsubscribe = current.addListener(
      // We don't wanna import tab types here to avoid extra deps
      // in addition, there are multiple tab implementations
      // @ts-ignore
      'tabPress',
      (tabPressEvent: EventArg<'tabPress', true>) => {
        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() =>
          callback({ tabPressEvent, currentNavigation: current })
        );
      }
    );

    return unsubscribe;
  }, [navigation, callback, route.key]);
}
