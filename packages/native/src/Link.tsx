import * as React from 'react';
import { Text, TextProps, Platform, GestureResponderEvent } from 'react-native';
import useLinkTo from './useLinkTo';

type Props = {
  to: string;
  target?: string;
  onLink?: (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent> | GestureResponderEvent
  ) => void;
} & (TextProps & { children: React.ReactNode });

export default function Link({ to, children, onLink, ...rest }: Props) {
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
      shouldHandle = event ? !event.defaultPrevented : true;
    } else if (
      !event.defaultPrevented && // onPress prevented default
      // @ts-ignore
      !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) && // ignore clicks with modifier keys
      // @ts-ignore
      (event.button == null || event.button === 0) && // ignore everything but left clicks
      (rest.target == null || rest.target === '_self') // let browser handle "target=_blank" etc.
    ) {
      event.preventDefault();
      shouldHandle = true;
    }

    if (shouldHandle) {
      if (onLink) {
        onLink(e);
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
