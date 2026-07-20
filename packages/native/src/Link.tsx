import { useTheme } from '@react-navigation/core';
import * as React from 'react';
import {
  type GestureResponderEvent,
  Platform,
  Text,
  type TextProps,
} from 'react-native';

import { type LinkProps, useLinkProps } from './useLinkProps';

type PressEvent =
  | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  | GestureResponderEvent;

type Props<ParamList extends ReactNavigation.RootParamList> =
  LinkProps<ParamList> &
    Omit<TextProps, 'disabled'> & {
      target?: string;
      onPress?: (e: PressEvent) => void;
      disabled?: boolean | undefined;
      children: React.ReactNode;
    };

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to override the in-page navigation. The `href` is still derived from `screen`, so this can be used to render a link while dispatching a different action (e.g. a `replace`).
 * @param props.children Child elements to render the content.
 */
export function Link<ParamList extends ReactNavigation.RootParamList>({
  screen,
  params,
  action,
  href,
  style,
  target,
  ...rest
}: Props<ParamList>) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps<ParamList>({ screen, params, action, href });

  // Keep usage of `useTheme` after `useLinkProps`
  // This ensures proper error when used outside of navigation container
  const { colors, fonts } = useTheme();

  const onPress = (e: PressEvent) => {
    if (rest.disabled) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }

    if ('onPress' in rest) {
      rest.onPress?.(e);
    }

    // Let user prevent default behavior
    if (!e.defaultPrevented) {
      props.onPress(e);
    }
  };

  return React.createElement(Text, {
    ...props,
    ...rest,
    ...Platform.select({
      web: {
        'aria-disabled': rest.disabled,
        onAuxClick: rest.disabled
          ? (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
              e.preventDefault();
              e.stopPropagation();
            }
          : undefined,
        onClick: onPress,
        hrefAttrs: { target },
      },
      default: { onPress },
    }),
    style: [{ color: colors.primary }, fonts.regular, style],
  });
}
