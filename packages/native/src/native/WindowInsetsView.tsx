import type { WindowInsetsViewProps } from './types';
import { View } from './View';

/**
 * View with the window insets for its position.
 *
 * Only supported on Android.
 */
export function WindowInsetsView(props: WindowInsetsViewProps) {
  return <View {...props} />;
}
