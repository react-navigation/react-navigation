import type { StyleProp, ViewStyle } from 'react-native';

export type ReservedRegion = {
  /**
   * The rect of the region relative to the view, including the margins.
   */
  frame: { x: number; y: number; width: number; height: number };
  /**
   * The margins included in the frame around the region for interactive content.
   */
  margins: { top: number; right: number; bottom: number; left: number };
  /**
   * Whether the region is currently active.
   */
  active: boolean;
};

export type ReservedRegionsProps = {
  /**
   * The kind of the reserved regions.
   * - `occlusion` - regions occluded by elements such as the status bar or the camera
   * - `division` - regions where the content should be divided, such as a fold
   *
   * @default 'occlusion'
   */
  kind?: 'occlusion' | 'division' | undefined;
  /**
   * Whether to include the regions that are currently inactive.
   *
   * @default false
   */
  includeInactive?: boolean | undefined;
  /**
   * Callback when the regions that overlap the view change.
   *
   * The regions are read for the view at its position without transforms.
   * They're only available on iOS 27.1+.
   */
  onRegionsChange?: ((regions: ReservedRegion[]) => void) | undefined;
  /**
   * Style object for the view, e.g. to cover the area to read the regions for.
   */
  style?: StyleProp<ViewStyle> | undefined;
};

/**
 * A view to get the regions reserved by the system that overlap it on iOS.
 *
 * The regions are read when the view is added to a window or the props change.
 * They're read again after a render if the position of the view in the window changed.
 * Changes outside of React (e.g. scrolling) aren't taken into account.
 */
export function ReservedRegions(_: ReservedRegionsProps) {
  return null;
}
