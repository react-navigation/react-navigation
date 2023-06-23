import type { NavigationAction } from '@react-navigation/core';
import * as React from 'react';
import { GestureResponderEvent, Platform, Text, TextProps } from 'react-native';

import useLinkProps from './useLinkProps';
import type { To } from './useLinkTo';

type Props<ParamList extends ReactNavigation.RootParamList> = {
  to: To<ParamList>;
  action?: NavigationAction;
  target?: string;
  onPress?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
} & (Omit<TextProps, 'disabled'> & {
  disabled?: boolean | null;
  children: React.ReactNode;
});

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.to Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export default function Link<ParamList extends ReactNavigation.RootParamList>({
  to,
  action,
  ...rest
}: Props<ParamList>) {
  const props = useLinkProps<ParamList>({ to, action });

  const onPress = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    if ('onPress' in rest) {
      rest.onPress?.(e);
    }

    props.onPress(e);
  };

  return React.createElement(Text, {
    ...props,
    ...rest,
    ...Platform.select({
      web: { onClick: onPress } as any,
      default: { onPress },
    }),
  });
}
