import ReactNavigationReservedRegionsViewNativeComponent from './ReactNavigationReservedRegionsViewNativeComponent';
import type { ReservedRegionsProps } from './types';

export function ReservedRegions({
  ref,
  onRegionsChange,
  children,
  style,
}: ReservedRegionsProps) {
  return (
    <ReactNavigationReservedRegionsViewNativeComponent
      ref={ref}
      onRegionsChange={onRegionsChange}
      style={[style, { pointerEvents: 'box-none' }]}
    >
      {children}
    </ReactNavigationReservedRegionsViewNativeComponent>
  );
}
