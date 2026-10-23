import type { ReservedRegionsProps } from './types';

/**
 * View that provides coordinates for the regions reserved by another entity,
 * such as the device's hardware.
 *
 * Reserved regions are available on iOS 27.1 and later.
 */
export function ReservedRegions({ children, style }: ReservedRegionsProps) {
  return (
    <div
      style={{
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        minHeight: 0,
        minWidth: 0,
        position: 'relative',
        ...style,
      }}
    >
      {children}
    </div>
  );
}
