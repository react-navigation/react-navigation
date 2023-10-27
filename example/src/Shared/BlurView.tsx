import * as React from 'react';
import { View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  tint: 'light' | 'dark';
  intensity: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function BlurView({ tint, intensity, ...rest }: Props) {
  return <View {...rest} />;
}
