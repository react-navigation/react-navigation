import ReactNavigationReservedRegionsViewNativeComponent from './ReactNavigationReservedRegionsViewNativeComponent';
// eslint-disable-next-line import-x/extensions
import type { ReservedRegionsProps } from './ReservedRegions.tsx';

export function ReservedRegions({
  kind,
  includeInactive,
  onRegionsChange,
  style,
}: ReservedRegionsProps) {
  return (
    <ReactNavigationReservedRegionsViewNativeComponent
      kind={kind}
      includeInactive={includeInactive}
      onRegionsChange={(e) => onRegionsChange?.(e.nativeEvent.regions)}
      // The view is often placed over other content, so it shouldn't block touches
      style={[style, { pointerEvents: 'none' }]}
    />
  );
}
