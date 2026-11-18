import ReactNavigationLayoutRegionViewNativeComponent from './ReactNavigationLayoutRegionViewNativeComponent';
import type { LayoutRegionViewProps } from './types';

export function LayoutRegionView({ style, ...rest }: LayoutRegionViewProps) {
  return (
    <ReactNavigationLayoutRegionViewNativeComponent
      {...rest}
      hasInsetsChangeListener={rest.onInsetsChange != null}
      style={[style, { pointerEvents: 'box-none' }]}
    />
  );
}
