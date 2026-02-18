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
} & React.ComponentProps<typeof View>;

export type CornerInsetRef = {
  relayout(): void;
};

function CornerInsetBase(
  props: CornerInsetProps,
  ref: React.Ref<CornerInsetRef>
) {
  React.useImperativeHandle(
    ref,
    () => ({
      relayout() {},
    }),
    []
  );

  return <View {...props} />;
}

export const CornerInset = React.forwardRef(CornerInsetBase);
