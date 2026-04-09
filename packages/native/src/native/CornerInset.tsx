import * as React from 'react';
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
  /**
   * Whether to collapse to 0 when corner inset matches the baseline inset.
   * e.g. it will be 0 for corners without traffic lights on iPadOS.
   *
   * @default true
   */
  adaptive?: boolean;
} & React.ComponentProps<typeof View>;

export type CornerInsetRef = {
  relayout(): void;
};

type Props = CornerInsetProps & {
  ref?: React.Ref<CornerInsetRef>;
};

export function CornerInset({ ref, ...rest }: Props) {
  React.useImperativeHandle(
    ref,
    () => ({
      relayout() {},
    }),
    []
  );

  return <View {...rest} />;
}
