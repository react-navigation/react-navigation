import type { ReservedRegionsViewProps } from './types';
import { View } from './View';

/**
 * View that provides coordinates for the regions reserved by another entity,
 * such as the device's hardware.
 *
 * Reserved regions are available on iOS 27.1 and later.
 */
export function ReservedRegionsView({
  ref,
  children,
  style,
}: ReservedRegionsViewProps) {
  return (
    <View ref={ref} style={style}>
      {children}
    </View>
  );
}
