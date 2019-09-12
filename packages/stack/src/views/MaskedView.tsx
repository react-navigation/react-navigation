import * as React from 'react';
import { UIManager } from 'react-native';
import RNCMaskedView from '@react-native-community/masked-view';

type Props = React.ComponentProps<typeof RNCMaskedView> & {
  children: React.ReactElement;
};

const isMaskedViewAvailable =
  // @ts-ignore
  UIManager.getViewManagerConfig('RNCMaskedView') != null;

export default function MaskedView({ children, ...rest }: Props) {
  if (isMaskedViewAvailable) {
    return <RNCMaskedView {...rest}>{children}</RNCMaskedView>;
  }

  return children;
}
