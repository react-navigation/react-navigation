import { useTheme } from '@react-navigation/native';
import * as React from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & {
  children: React.ReactNode;
};

export default function Background({ style, ...rest }: Props) {
  const { colors } = useTheme();

  return (
    <View
      {...rest}
      style={[{ flex: 1, backgroundColor: colors.background }, style]}
    />
  );
}
