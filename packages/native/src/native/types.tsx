import type { ColorValue } from 'react-native';

import type { FontWeight } from './constants';
import type { MaterialSymbolName } from './MaterialSymbolData';

export type MaterialSymbolOptions = {
  /**
   * The name of the Material Symbol to display.
   */
  name: MaterialSymbolName;
  /**
   * The size of the symbol.
   *
   * @default 24
   */
  size?: number;
  /**
   * The color of the symbol.
   *
   * @default 'black'
   */
  color?: ColorValue;
};

export type SFSymbolScale = 'small' | 'medium' | 'large';

export type SFSymbolMode =
  | 'monochrome'
  | 'hierarchical'
  | 'palette'
  | 'multicolor';

export type SFSymbolAnimationEffect =
  | 'bounce'
  | 'pulse'
  | 'appear'
  | 'disappear'
  | 'variableColor'
  | 'breathe'
  | 'wiggle'
  | 'rotate';

export type SFSymbolAnimationConfig = {
  /**
   * The animation effect to apply.
   */
  effect: SFSymbolAnimationEffect;
  /**
   * Whether the animation repeats continuously.
   *
   * @default false
   */
  repeating?: boolean;
  /**
   * Number of times to repeat the animation.
   * Ignored if `repeating` is `true`.
   */
  repeatCount?: number;
  /**
   * Speed multiplier for the animation.
   *
   * @default 1
   */
  speed?: number;
  /**
   * Whether to animate the whole symbol at once or layer by layer.
   *
   * @default false
   */
  wholeSymbol?: boolean;
  /**
   * Direction of the animation.
   * Applicable to `bounce` and `wiggle`.
   */
  direction?: 'up' | 'down';
  /**
   * Whether the variable color effect reverses with each cycle.
   * Only applicable to `variableColor`.
   *
   * @default false
   */
  reversing?: boolean;
  /**
   * Whether each layer remains changed until the end of the cycle.
   * Only applicable to `variableColor`.
   *
   * @default false
   */
  cumulative?: boolean;
};

export type SFSymbolAnimation =
  | SFSymbolAnimationEffect
  | SFSymbolAnimationConfig;

export type SFSymbolOptions = {
  /**
   * The name of the SF Symbol to display.
   */
  name: import('sf-symbols-typescript').SFSymbol;
  /**
   * The size of the symbol.
   * @default 24
   */
  size?: number;
  /**
   * The color of the symbol.
   * Used as the tint color in monochrome mode, and as the fallback for
   * `colors.primary` in hierarchical and palette modes.
   *
   * @default 'black'
   */
  color?: ColorValue;
  /**
   * The weight of the symbol.
   *
   * @default 'regular'
   */
  weight?: FontWeight;
  /**
   * The scale of the symbol relative to the font size.
   *
   * @default 'medium'
   */
  scale?: SFSymbolScale;
  /**
   * The rendering mode of the symbol.
   * - `monochrome`: Single color tint (default).
   * - `hierarchical`: Derived hierarchy from a single color.
   * - `palette`: Explicit colors for each layer.
   * - `multicolor`: Uses the symbol's built-in multicolor scheme.
   *
   * @default 'monochrome'
   */
  mode?: SFSymbolMode;
  /**
   * The colors for non-monochrome rendering modes.
   * - `hierarchical`: uses `primary` as the base color.
   * - `palette`: uses `primary`, `secondary`, and `tertiary` for each layer.
   * - `multicolor`: ignored.
   *
   * Falls back to `color` for `primary` if not specified.
   */
  colors?: {
    primary?: ColorValue;
    secondary?: ColorValue;
    tertiary?: ColorValue;
  };
  /**
   * The animation effect to apply to the symbol.
   * Requires iOS 17+. Ignored on earlier versions.
   */
  animation?: SFSymbolAnimation;
};
