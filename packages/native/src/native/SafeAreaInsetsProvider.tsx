import type { SafeAreaInsetsProviderProps } from './types';
import { View } from './View';

/**
 * View that provides additional safe area insets to its content.
 *
 * Only supported on iOS.
 */
export function SafeAreaInsetsProvider({
  children,
  style,
}: SafeAreaInsetsProviderProps) {
  return <View style={style}>{children}</View>;
}
