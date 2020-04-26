import * as React from 'react';
import { Text, TextProps, Platform, GestureResponderEvent } from 'react-native';
import useLinkTo from './useLinkTo';

type Props = {
  to: string;
  target?: string;
} & (TextProps & { children: React.ReactNode });

export default function Link({ to, children, ...rest }: Props) {
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
      linkTo(to);
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
