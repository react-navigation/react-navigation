import { View } from 'react-native';

import type { LayoutRegionViewProps } from './types';

export function LayoutRegionView({ style, children }: LayoutRegionViewProps) {
  return <View style={[style, { pointerEvents: 'box-none' }]}>{children}</View>;
}
