import { type RootParamList, useTheme } from '@react-navigation/core';
import { type GestureResponderEvent, Text } from 'react-native';

// eslint-disable-next-line import-x/extensions
import type { Props } from './Link.tsx';
import { useLinkProps } from './useLinkProps';

export function Link<
  ParamList extends {} = RootParamList,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    keyof ParamList,
    string
  >,
>({
  in: parent,
  screen,
  params,
  action,
  href,
  style,
  target: _target,
  disabled,
  children,
  ...rest
}: Props<ParamList, RouteName>) {
  // @ts-expect-error: destructuring loses the relationship between target props
  const props = useLinkProps({ in: parent, screen, params, action, href });

  // Keep usage of `useTheme` after `useLinkProps`
  // This ensures proper error when used outside of navigation container
  const { colors, fonts } = useTheme();

  const onPress = (e: GestureResponderEvent) => {
    rest.onPress?.(e);

    // Let user prevent default behavior
    if (!e.defaultPrevented) {
      props.onPress(e);
    }
  };

  return (
    <Text
      {...props}
      {...rest}
      disabled={disabled}
      onPress={onPress}
      style={[{ color: colors.primary }, fonts.regular, style]}
    >
      {children}
    </Text>
  );
}
