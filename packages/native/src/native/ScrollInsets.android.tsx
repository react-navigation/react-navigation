import NativeWindowInsetsView from './ReactNavigationWindowInsetsViewNativeComponent';
import type { ScrollInsetsProps } from './types';

export function ScrollInsets({
  children,
  types = ['systemBars', 'displayCutout', 'custom'],
  ignoreVisibility,
  style,
}: ScrollInsetsProps) {
  return (
    <NativeWindowInsetsView
      adjustScrollInsets
      types={types}
      ignoreVisibility={ignoreVisibility}
      edges={{
        top: 'additive',
        bottom: 'additive',
        start: 'additive',
        end: 'additive',
      }}
      style={[{ flex: 1, pointerEvents: 'box-none' }, style]}
    >
      {children}
    </NativeWindowInsetsView>
  );
}
