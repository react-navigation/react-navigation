import { useLinkProps, useTheme } from '@react-navigation/native';
import Color from 'color';
import * as React from 'react';
import { StyleSheet } from 'react-native';

import {
  PlatformPressable,
  type Props as PlatformPressableProps,
} from './PlatformPressable';
import { Text } from './Text';

type BaseProps = Omit<PlatformPressableProps, 'children'> & {
  variant?: 'plain' | 'tinted' | 'filled';
  color?: string;
  children: string | string[];
};

type LinkProps = Omit<BaseProps, 'onPress'> &
  Parameters<typeof useLinkProps>[0];

const BUTTON_RADIUS = 40;

export function Button(props: BaseProps | LinkProps) {
  if ('screen' in props || 'action' in props) {
    return <ButtonLink {...props} />;
  } else {
    return <ButtonBase {...props} />;
  }
}

function ButtonLink({ screen, params, action, href, ...rest }: LinkProps) {
  // @ts-expect-error: This is already type-checked by the prop types
  const props = useLinkProps({ screen, params, action, href });

  return <ButtonBase {...rest} {...props} />;
}

function ButtonBase({
  variant = 'tinted',
  color: customColor,
  android_ripple,
  style,
  children,
  ...rest
}: BaseProps) {
  const { colors, fonts } = useTheme();

  const color = customColor ?? colors.primary;

  let backgroundColor;
  let textColor;

  switch (variant) {
    case 'plain':
      backgroundColor = 'transparent';
      textColor = color;
      break;
    case 'tinted':
      backgroundColor = Color(color).fade(0.85).string();
      textColor = color;
      break;
    case 'filled':
      backgroundColor = color;
      textColor = Color(color).isDark()
        ? 'white'
        : Color(color).darken(0.71).string();
      break;
  }

  return (
    <PlatformPressable
      {...rest}
      style={[{ backgroundColor }, styles.button, style]}
      android_ripple={{
        radius: BUTTON_RADIUS,
        color: Color(textColor).fade(0.85).string(),
        ...android_ripple,
      }}
    >
      <Text style={[{ color: textColor }, fonts.regular, styles.text]}>
        {children}
      </Text>
    </PlatformPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: BUTTON_RADIUS,
  },
  text: {
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0.1,
    textAlign: 'center',
  },
});
