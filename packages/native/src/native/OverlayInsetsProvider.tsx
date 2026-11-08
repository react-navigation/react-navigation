import type { OverlayInsetsProviderProps } from './types';
import { View } from './View';

/**
 * View that provides additional safe area insets to its content.
 *
 * Only supported on iOS.
 */
export function OverlayInsetsProvider(props: OverlayInsetsProviderProps) {
  return <View {...props} />;
}
