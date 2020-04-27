import * as React from 'react';
import { Text, TextProps, Platform, GestureResponderEvent } from 'react-native';
import {
  NavigationAction,
  NavigationHelpersContext,
} from '@react-navigation/core';
import useLinkTo from './useLinkTo';

type Props = {
  to: string;
  action?: NavigationAction;
  target?: string;
} & (TextProps & { children: React.ReactNode });

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.to Absolute path to screen (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export default function Link({ to, action, children, ...rest }: Props) {
  const navigation = React.useContext(NavigationHelpersContext);
  const linkTo = useLinkTo();

  const onPress = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    if ('onPress' in rest) {
      // @ts-ignore
      rest.onPress?.(e);
    }

    let shouldHandle = false;

    if (Platform.OS !== 'web' || !event) {
      shouldHandle = event ? !e.defaultPrevented : true;
    } else if (
      !e.defaultPrevented && // onPress prevented default
      // @ts-ignore
      !(e.metaKey || e.altKey || e.ctrlKey || e.shiftKey) && // ignore clicks with modifier keys
      // @ts-ignore
      (e.button == null || e.button === 0) && // ignore everything but left clicks
      (rest.target == null || rest.target === '_self') // let browser handle "target=_blank" etc.
    ) {
      event.preventDefault();
      shouldHandle = true;
    }

    if (shouldHandle) {
      if (action) {
        if (navigation) {
          navigation.dispatch(action);
        } else {
          throw new Error("Couldn't find a navigation object.");
        }
      } else {
        linkTo(to);
      }
    }
  };

  const props = {
    href: to,
    accessibilityRole: 'link' as const,
    ...Platform.select({
      web: { onClick: onPress } as any,
      default: { onPress },
    }),
    ...rest,
  };

  return <Text {...props}>{children}</Text>;
}
