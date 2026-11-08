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
      onRegionsChange={onRegionsChange}
      style={[style, { pointerEvents: 'box-none' }]}
      // @ts-expect-error: the ref type covers the div on Web too, but union produces type error
      ref={ref}
    >
      {children}
    </ReactNavigationReservedRegionsViewNativeComponent>
  );
}
