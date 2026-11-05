import { View } from 'react-native';

import type { ReservedRegionsProps } from './types';

export function ReservedRegions({
  ref,
  children,
  style,
}: ReservedRegionsProps) {
  return (
    <View ref={ref} style={[style, { pointerEvents: 'box-none' }]}>
      {children}
    </View>
  );
}
