import { View, type ViewProps } from 'react-native';

type Props = ViewProps & {
  tint: 'light' | 'dark';
  intensity: number;
};

export function BlurView({ tint: _0, intensity: _1, ...rest }: Props) {
  return <View {...rest} />;
}
