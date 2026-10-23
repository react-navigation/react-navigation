import type { ViewStyle } from 'react-native';

export type LayoutInsetProps = {
  /**
   * The edge where the inset should be applied.
   */
  edge: 'top' | 'right' | 'bottom' | 'left';
  /**
   * The direction of the content to adapt to the corners for.
   * e.g. on iPadOS, the corner with the traffic lights.
   */
  cornerAdaptation: 'vertical' | 'horizontal';
  /**
   * Whether to collapse to 0 when the corner adapted inset matches the inset without adaptation.
   * e.g. it will be 0 for corners without traffic lights on iPadOS.
   *
   * @default false
   */
  collapseUnlessAdapted?: boolean | undefined;
  /**
   * Style object for the inset view.
   */
  style?: ViewStyle | undefined;
};

/**
 * A spacer sized to the layout margins at an edge, adapted to the corners of the window.
 *
 * Requires iOS 26+. The inset is 0 on older versions, and nothing is rendered on other platforms.
 */
export function LayoutInset(_: LayoutInsetProps) {
  return null;
}
