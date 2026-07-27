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
  disabled,
  children,
  onPress,
  id,
  numberOfLines,
  testID,
  'aria-label': ariaLabel,
  'aria-busy': ariaBusy,
  'aria-expanded': ariaExpanded,
  'aria-hidden': ariaHidden,
  'aria-labelledby': ariaLabelledBy,
  'aria-live': ariaLive,
}: Props<ParamList, RouteName>) {
  // @ts-expect-error: destructuring loses the relationship between target props
  const props = useLinkProps({ in: parent, screen, params, action, href });

  // Keep usage of `useTheme` after `useLinkProps`
  // This ensures proper error when used outside of navigation container
  const { colors, fonts } = useTheme();

  const onLinkPress = (e: GestureResponderEvent) => {
    onPress?.(e);

    // Let user prevent default behavior
    if (!e.defaultPrevented) {
      props.onPress(e);
    }
  };

  return (
    <Text
      {...props}
      aria-busy={ariaBusy}
      aria-expanded={ariaExpanded}
      aria-hidden={ariaHidden}
      aria-label={ariaLabel}
      accessibilityLabelledBy={ariaLabelledBy}
      accessibilityLiveRegion={ariaLive === 'off' ? 'none' : ariaLive}
      disabled={disabled}
      id={id}
      testID={testID}
      numberOfLines={numberOfLines}
      onPress={onLinkPress}
      style={[{ color: colors.primary }, fonts.regular, style]}
    >
      {children}
    </Text>
  );
}
