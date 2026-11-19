import ReactNavigationWindowInsetsViewNativeComponent from './ReactNavigationWindowInsetsViewNativeComponent';
import type { WindowInsetsViewProps } from './types';

export function WindowInsetsView({
  ref,
  style,
  ...rest
}: WindowInsetsViewProps) {
  return (
    <ReactNavigationWindowInsetsViewNativeComponent
      {...rest}
      hasInsetsChangeListener={rest.onInsetsChange != null}
      style={[style, { pointerEvents: 'box-none' }]}
      // @ts-expect-error: the ref type covers the div on Web too, but union produces type error
      ref={ref}
    />
  );
}
