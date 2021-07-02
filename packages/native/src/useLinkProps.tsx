import {
  NavigationAction,
  NavigationContainerRefContext,
  NavigationHelpersContext,
} from '@react-navigation/core';
import * as React from 'react';
import { GestureResponderEvent, Platform } from 'react-native';

import useLinkTo, { To } from './useLinkTo';

type Props<ParamList extends ReactNavigation.RootParamList> = {
  to: To<ParamList>;
  action?: NavigationAction;
};

/**
 * Hook to get props for an anchor tag so it can work with in page navigation.
 *
 * @param props.to Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 */
export default function useLinkProps<
  ParamList extends ReactNavigation.RootParamList
>({ to, action }: Props<ParamList>) {
  const root = React.useContext(NavigationContainerRefContext);
  const navigation = React.useContext(NavigationHelpersContext);
  const linkTo = useLinkTo<ParamList>();

  const onPress = (
    e?: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    let shouldHandle = false;

    if (Platform.OS !== 'web' || !e) {
      shouldHandle = e ? !e.defaultPrevented : true;
    } else if (
      !e.defaultPrevented && // onPress prevented default
      // @ts-expect-error: these properties exist on web, but not in React Native
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
      // @ts-expect-error: these properties exist on web, but not in React Native
      (e.button == null || e.button === 0) && // ignore everything but left clicks
      // @ts-expect-error: these properties exist on web, but not in React Native
      [undefined, null, '', 'self'].includes(e.currentTarget?.target) // let browser handle "target=_blank" etc.
    ) {
      e.preventDefault();
      shouldHandle = true;
    }

    if (shouldHandle) {
      if (action) {
        if (navigation) {
          navigation.dispatch(action);
        } else if (root) {
          root.dispatch(action);
        } else {
          throw new Error(
            "Couldn't find a navigation object. Is your component inside NavigationContainer?"
          );
        }
      } else {
        linkTo(to);
      }
    }
  };

  return {
    href: to,
    accessibilityRole: 'link' as const,
    onPress,
  };
}
