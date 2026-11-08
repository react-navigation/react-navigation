import ReactNavigationSafeAreaInsetsProviderNativeComponent from './ReactNavigationSafeAreaInsetsProviderNativeComponent';
import type { SafeAreaInsetsProviderProps } from './types';

export function SafeAreaInsetsProvider({
  insets,
  children,
  style,
}: SafeAreaInsetsProviderProps) {
  return (
    <ReactNavigationSafeAreaInsetsProviderNativeComponent
      insets={insets}
      style={[style, { pointerEvents: 'box-none' }]}
    >
      {children}
    </ReactNavigationSafeAreaInsetsProviderNativeComponent>
  );
}
