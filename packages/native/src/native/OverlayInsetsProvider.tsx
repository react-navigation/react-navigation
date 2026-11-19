import type { OverlayInsetsProviderProps } from './types';
import { View } from './View';

/**
 * View that provides insets for custom overlays to its content.
 *
 * Only supported on iOS and Android.
 */
export function OverlayInsetsProvider(props: OverlayInsetsProviderProps) {
  return <View {...props} />;
}
