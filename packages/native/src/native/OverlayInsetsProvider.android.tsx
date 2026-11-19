import ReactNavigationOverlayInsetsProviderNativeComponent from './ReactNavigationOverlayInsetsProviderNativeComponent';
import type { OverlayInsetsProviderProps } from './types';

export function OverlayInsetsProvider({
  insets,
  children,
  style,
}: OverlayInsetsProviderProps) {
  return (
    <ReactNavigationOverlayInsetsProviderNativeComponent
      insets={insets}
      style={[style, { pointerEvents: 'box-none' }]}
    >
      {children}
    </ReactNavigationOverlayInsetsProviderNativeComponent>
  );
}
