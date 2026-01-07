import { View } from 'react-native';

import type { NativeProps } from './ReactNavigationCornerInsetViewNativeComponent';

export function CornerInset(props: NativeProps) {
  return <View {...props} />;
}

export type { NativeProps as CornerInsetProps };
