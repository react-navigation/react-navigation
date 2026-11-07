import ReactNavigationReservedRegionsViewNativeComponent from './ReactNavigationReservedRegionsViewNativeComponent';
import type { ReservedRegionsViewProps } from './types';

export function ReservedRegionsView({
  ref,
  onRegionsChange,
  children,
  style,
}: ReservedRegionsViewProps) {
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
