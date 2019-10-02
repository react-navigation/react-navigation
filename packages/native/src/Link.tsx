import * as React from 'react';
import { Text, TextProps, GestureResponderEvent, Platform } from 'react-native';
import useLinkTo from './useLinkTo';

type Props = {
  to: string;
  target?: string;
} & (TextProps & { children: React.ReactNode });

export default function Link({ to, children, ...rest }: Props) {
  const linkTo = useLinkTo();

  const onPress = (e: GestureResponderEvent | undefined) => {
    if ('onPress' in rest) {
      rest.onPress?.(e as GestureResponderEvent);
    }

    const event = (e?.nativeEvent as any) as
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      | undefined;

    if (Platform.OS !== 'web' || !event) {
      linkTo(to);
      return;
    }

    event.preventDefault();

    if (
      !event.defaultPrevented && // onPress prevented default
      !(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey) && // ignore clicks with modifier keys
      (event.button == null || event.button === 0) && // ignore everything but left clicks
      (rest.target == null || rest.target === '_self') // let browser handle "target=_blank" etc.
    ) {
      event.preventDefault();
      linkTo(to);
    }
  };

  const props = {
    href: to,
    onPress,
    accessibilityRole: 'link' as const,
    ...rest,
  };

  return <Text {...props}>{children}</Text>;
}
