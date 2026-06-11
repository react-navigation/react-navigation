import { type RootParamList, useTheme } from '@react-navigation/core';
import * as React from 'react';
import {
  type GestureResponderEvent,
  Platform,
  Text,
  type TextProps,
} from 'react-native';

import { type LinkProps, useLinkProps } from './useLinkProps';

type Props<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
> = LinkProps<NoInfer<ParamList>, RouteName> &
  Omit<TextProps, 'disabled'> & {
    target?: string;
    onPress?: (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
    ) => void;
    disabled?: boolean | null;
    children: React.ReactNode;
  };

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.in Name of the current or parent screen whose navigator contains the target screen.
 * @param props.screen Name of the screen to navigate to (e.g. `'Feeds'`).
 * @param props.params Params to pass to the screen to navigate to (e.g. `{ sort: 'hot' }`).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export function Link<
  const ParamList extends {} = RootParamList,
  const RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
>(props: Props<ParamList, RouteName>) {
  // prettier-ignore
  // @ts-expect-error: TypeScript doesn't preserve common optional properties across this generic union.
  const { in: parent, screen, params, action, href, disabled, style, ...rest } = props;

  const { colors, fonts } = useTheme();
  const linkProps =
    screen === undefined
      ? { action, href }
      : parent === undefined
        ? { screen, params, action, href }
        : { in: parent, screen, params, action, href };

  const link = useLinkProps(linkProps);

  const onPress = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => {
    if ('onPress' in rest) {
      rest.onPress?.(e);
    }

    // Let user prevent default behavior
    if (!e.defaultPrevented) {
      link.onPress(e);
    }
  };

  return React.createElement(Text, {
    ...link,
    ...rest,
    ...Platform.select({
      web: { onClick: onPress },
      default: { onPress },
    }),
    disabled: disabled ?? undefined,
    style: [{ color: colors.primary }, fonts.regular, style],
  });
}
