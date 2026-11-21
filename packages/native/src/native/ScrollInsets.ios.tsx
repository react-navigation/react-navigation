import NativeLayoutRegionView from './ReactNavigationLayoutRegionViewNativeComponent';
import type { ScrollInsetsProps } from './types';

export function ScrollInsets({
  children,
  cornerAdaptation,
  style,
}: ScrollInsetsProps) {
  return (
    <NativeLayoutRegionView
      region="safeArea"
      edges={{
        top: 'additive',
        bottom: 'additive',
        start: 'additive',
        end: 'additive',
      }}
      adjustScrollInsets
      cornerAdaptation={cornerAdaptation}
      style={[{ flex: 1, pointerEvents: 'box-none' }, style]}
    >
      {children}
    </NativeLayoutRegionView>
  );
}
