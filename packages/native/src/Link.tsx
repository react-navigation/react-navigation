import * as React from 'react';
import { GestureResponderEvent, Platform, Text, TextProps } from 'react-native';

import useLinkProps, { Props as LinkProps } from './useLinkProps';

type Props<ParamList extends ReactNavigation.RootParamList> =
  LinkProps<ParamList> & {
    target?: string;
    onPress?: (
      e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
    ) => void;
  } & (TextProps & { children: React.ReactNode });

/**
 * Component to render link to another screen using a path.
 * Uses an anchor tag on the web.
 *
 * @param props.to Screen to navigate to (e.g. { screen: 'Feeds', params: { sort: 'hot' } }).
 * @param props.href Optional absolute path to use for the href (e.g. `/feeds/hot`).
 * @param props.action Optional action to use for in-page navigation. By default, the path is parsed to an action based on linking config.
 * @param props.children Child elements to render the content.
 */
export default function Link<ParamList extends ReactNavigation.RootParamList>({
  screen,
  params,
  action,
  href,
  ...rest
}: Props<ParamList>) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps<ParamList>({ screen, params, action, href });

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
