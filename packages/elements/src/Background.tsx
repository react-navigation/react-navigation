import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { Animated, ViewProps } from 'react-native';

type Props = ViewProps & {
  children: React.ReactNode;
};

export function Background({ style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <Animated.View
      {...rest}
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
    />
  );
}
