import { View } from 'react-native';

import type { ReservedRegionsViewProps } from './types';

export function ReservedRegionsView({
  ref,
  children,
  style,
}: ReservedRegionsViewProps) {
  return (
    <View ref={ref} style={[style, { pointerEvents: 'box-none' }]}>
      {children}
    </View>
  );
}
