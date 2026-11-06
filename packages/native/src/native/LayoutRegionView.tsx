import type { LayoutRegionViewProps } from './types';

/**
 * View with the insets of a layout region, such as the safe area.
 *
 * Only supported on iOS.
 */
export function LayoutRegionView({ style, children }: LayoutRegionViewProps) {
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
