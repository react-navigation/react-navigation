import ReactNavigationLayoutRegionViewNativeComponent from './ReactNavigationLayoutRegionViewNativeComponent';
import type { LayoutRegionViewProps } from './types';

export function LayoutRegionView({
  ref,
  style,
  ...rest
}: LayoutRegionViewProps) {
  return (
    <ReactNavigationLayoutRegionViewNativeComponent
      {...rest}
      hasInsetsChangeListener={rest.onInsetsChange != null}
      style={[style, { pointerEvents: 'box-none' }]}
      // @ts-expect-error: the ref type covers the div on Web too, but union produces type error
      ref={ref}
    />
  );
}
