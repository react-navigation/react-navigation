import type { HostComponent, ViewProps } from 'react-native';

export type LiquidGlassViewProps = ViewProps & {
  /**
   * Whether touches make the glass grow and shimmer.
   *
   * @default false
   */
  interactive?: boolean | undefined;
  /**
   * Color scheme used for the glass and its content.
   * Useful to match the glass to the app's theme when it differs from the system.
   *
   * @default 'system'
   */
  colorScheme?: 'light' | 'dark' | 'system' | undefined;
};

export type LiquidGlassContainerViewProps = ViewProps & {
  /**
   * Distance between glass views at which they start to merge.
   *
   * @default 0
   */
  spacing?: number | undefined;
};

/**
 * View with the liquid glass effect on iOS 26 and later.
 */
export const LiquidGlassView: HostComponent<LiquidGlassViewProps> = () => {
  throw new Error('LiquidGlassView is only supported on iOS.');
};

/**
 * Container for glass views, so nearby glass views can merge on iOS 26 and later.
 */
export const LiquidGlassContainerView: HostComponent<
  LiquidGlassContainerViewProps
> = () => {
  throw new Error('LiquidGlassContainerView is only supported on iOS.');
};

/**
 * Whether the liquid glass effect is supported.
 * It's supported on iOS 26 and later, unless the app opts out with `UIDesignRequiresCompatibility`.
 * Apps built with the iOS 27 SDK can't opt out.
 */
export const isLiquidGlassSupported: boolean = false;
