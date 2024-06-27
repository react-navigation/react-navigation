// TODO
// @ts-expect-error: investigate why TypeScript errors here
import * as React from 'react';
import { View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  tint: 'light' | 'dark';
  intensity: number;
};

export function BlurView({ tint: _0, intensity: _1, ...rest }: Props) {
  return <View {...rest} />;
}
