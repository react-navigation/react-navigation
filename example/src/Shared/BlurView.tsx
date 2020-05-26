import * as React from 'react';
import { View, ViewProps } from 'react-native';

type Props = ViewProps & {
  tint: 'light' | 'dark';
  intensity: number;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function BlurView({ tint, intensity, ...rest }: Props) {
  return <View {...rest} />;
}
