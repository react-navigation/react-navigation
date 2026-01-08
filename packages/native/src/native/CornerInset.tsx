import { View } from 'react-native';

export type CornerInsetProps = {
  /**
   * The direction of the content that should be inset.
   */
  direction: 'vertical' | 'horizontal';
  /**
   * The edge where the inset should be applied.
   */
  edge: 'top' | 'right' | 'bottom' | 'left';
} & React.ComponentProps<typeof View>;

export function CornerInset(props: CornerInsetProps) {
  return <View {...props} />;
}
