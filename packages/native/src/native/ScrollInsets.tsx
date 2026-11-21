import type { ScrollInsetsProps } from './types';
import { View } from './View';

export function ScrollInsets({ children, style }: ScrollInsetsProps) {
  return <View style={{ flex: 1, ...style }}>{children}</View>;
}
