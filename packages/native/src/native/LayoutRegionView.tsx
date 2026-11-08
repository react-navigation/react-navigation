import type { LayoutRegionViewProps } from './types';
import { View } from './View';

/**
 * View with the insets of a layout region, such as the safe area.
 *
 * Only supported on iOS.
 */
export function LayoutRegionView({ style, children }: LayoutRegionViewProps) {
  return <View style={style}>{children}</View>;
}
