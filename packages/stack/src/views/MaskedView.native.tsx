import * as React from 'react';
import { UIManager } from 'react-native';

type MaskedViewType = typeof import('@react-native-community/masked-view').default;

type Props = React.ComponentProps<MaskedViewType> & {
  children: React.ReactElement;
};

let RNCMaskedView: MaskedViewType | undefined;

try {
  RNCMaskedView = require('@react-native-community/masked-view').default;
} catch (e) {
  // Ignore
}

const isMaskedViewAvailable =
  UIManager.getViewManagerConfig('RNCMaskedView') != null;

export default function MaskedView({ children, ...rest }: Props) {
  if (isMaskedViewAvailable && RNCMaskedView) {
    return <RNCMaskedView {...rest}>{children}</RNCMaskedView>;
  }

  return children;
}
