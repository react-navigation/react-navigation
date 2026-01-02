import { View, type ViewProps } from 'react-native';

export type CornerAdaptivityDirection = 'vertical' | 'horizontal';

export type CornerAdaptivityViewProps = ViewProps & {
  direction: CornerAdaptivityDirection;
};

export function CornerAdaptivityView(props: CornerAdaptivityViewProps) {
  return <View {...props} />;
}
