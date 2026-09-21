import type { ColorValue } from 'react-native';

import type { SFSymbolNames } from '../types';
import type { FONT_WEIGHTS } from './constants';
import type { MaterialSymbolName } from './MaterialSymbolData';

export type MaterialSymbolOptions = {
  /**
   * The name of the Material Symbol to display.
   */
  name: MaterialSymbolName;
  /**
   * The variant of the symbol.
   *
   * Can be customized using `react-navigation` key in `package.json`:
   *
   * ```json
   * "react-navigation": {
   *   "material-symbol": {
   *     "fonts": [
   *       {
   *         "variant": "rounded",
   *         "weight": 300,
   *       },
   *     ]
   *   }
   * }
   * ```
   *
   * Automatically set if a single variant is available.
   *
   * @default 'outlined'
   */
  variant?: 'outlined' | 'rounded' | 'sharp' | undefined;
  /**
   * The weight of the symbol.
   *
   * Can be customized using `react-navigation` key in `package.json`:
   *
   * ```json
   * "react-navigation": {
   *   "material-symbol": {
   *     "fonts": [
   *       {
   *         "variant": "rounded",
   *         "weight": 300,
   *       },
   *     ]
   *   }
   * }
   * ```
   *
   * Only numeric weights are supported in the configuration.
   *
   * Automatically set if a single weight is available.
   *
   * @default 400
   */
  weight?:
    | 'thin'
    | 'ultralight'
    | 'light'
    | 'regular'
    | 'medium'
    | 'semibold'
    | 'bold'
    | 100
    | 200
    | 300
    | 400
    | 500
    | 600
    | 700
    | undefined;
  /**
   * The size of the symbol.
   *
   * @default 24
   */
  size?: number | undefined;
  /**
   * The color of the symbol.
   *
   * @default 'black'
   */
  color?: ColorValue | undefined;
};

type SFSymbolScale = 'small' | 'medium' | 'large';

type SFSymbolRenderingMode =
  | 'monochrome'
  | 'hierarchical'
  | 'palette'
  | 'multicolor';

export type SFSymbolEffectName =
  | 'bounce'
  | 'pulse'
  | 'appear'
  | 'disappear'
  | 'variableColor'
  | 'scale'
  | 'breathe'
  | 'wiggle'
  | 'rotate'
  | 'drawOn'
  | 'drawOff';

export type SFSymbolContentTransitionEffect = 'automatic' | 'replace';

export type SFSymbolEffectRepeat =
  | 'continuous'
  | 'nonRepeating'
  | {
      /**
       * Number of times to repeat the effect.
       */
      count?: number | undefined;
      /**
       * Delay in seconds between repeated effect cycles.
       */
      delay?: number | undefined;
    };

export type SFSymbolEffectScope = 'byLayer' | 'wholeSymbol' | 'individually';

export type SFSymbolEffectDirection =
  | 'up'
  | 'down'
  | 'left'
  | 'right'
  | 'forward'
  | 'backward'
  | 'clockwise'
  | 'counterClockwise';

export type SFSymbolBreatheVariant = 'plain' | 'pulse';

export type SFSymbolDrawDirection = 'reversed' | 'nonReversed';

export type SFSymbolInactiveLayers = 'hide' | 'dim';

type SFSymbolEffectBaseConfig = {
  /**
   * Speed multiplier for the effect.
   *
   * @default 1
   */
  speed?: number | undefined;
  /**
   * Repeat behavior for the effect. Use an object for periodic repeats.
   */
  repeat?: SFSymbolEffectRepeat | undefined;
};

type SFSymbolScopedEffectConfig = SFSymbolEffectBaseConfig & {
  /**
   * Whether to animate the whole symbol at once or by layer.
   *
   * @default 'byLayer'
   */
  scope?: Extract<SFSymbolEffectScope, 'byLayer' | 'wholeSymbol'> | undefined;
};

type SFSymbolDirectionalEffectName = 'bounce' | 'appear' | 'disappear';

type SFSymbolDirectionalEffectConfig = SFSymbolScopedEffectConfig & {
  /**
   * The symbol effect to apply.
   */
  type: SFSymbolDirectionalEffectName;
  /**
   * The direction the symbol moves during the effect.
   */
  direction?: 'up' | 'down' | undefined;
};

type SFSymbolScaleEffectConfig = SFSymbolScopedEffectConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'scale';
  /**
   * Whether the symbol scales up or down.
   */
  direction?: 'up' | 'down' | undefined;
};

type SFSymbolBasicScopedEffectConfig = SFSymbolScopedEffectConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'pulse';
};

type SFSymbolBreatheEffectConfig = SFSymbolScopedEffectConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'breathe';
  /**
   * The breathe effect variant.
   */
  variant?: SFSymbolBreatheVariant | undefined;
};

type SFSymbolWiggleEffectConfig = SFSymbolScopedEffectConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'wiggle';
  /**
   * The direction the symbol wiggles toward.
   */
  direction?: SFSymbolEffectDirection | undefined;
  /**
   * A custom wiggle angle in degrees. Overrides `direction` when set.
   */
  angle?: number | undefined;
};

type SFSymbolRotateEffectConfig = SFSymbolScopedEffectConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'rotate';
  /**
   * Which way the symbol rotates.
   */
  direction?: 'clockwise' | 'counterClockwise' | undefined;
};

type SFSymbolDrawEffectConfig = SFSymbolEffectBaseConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'drawOn';
  /**
   * Whether to animate the whole symbol at once, by layer, or individually.
   *
   * @default 'byLayer'
   */
  scope?: SFSymbolEffectScope | undefined;
};

type SFSymbolDrawOffEffectConfig = SFSymbolEffectBaseConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'drawOff';
  /**
   * Whether to animate the whole symbol at once, by layer, or individually.
   *
   * @default 'byLayer'
   */
  scope?: SFSymbolEffectScope | undefined;
  /**
   * Whether the draw-off animation follows the symbol's authored draw
   * order or plays it in reverse.
   * - `nonReversed`: follows the symbol's draw order.
   * - `reversed`: plays it in reverse.
   */
  drawDirection?: SFSymbolDrawDirection | undefined;
};

type SFSymbolVariableColorEffectConfig = SFSymbolEffectBaseConfig & {
  /**
   * The symbol effect to apply.
   */
  type: 'variableColor';
  /**
   * Whether the variable color effect reverses with each cycle.
   *
   * @default false
   */
  reversing?: boolean | undefined;
  /**
   * Whether layers light up cumulatively and stay active through the
   * cycle, rather than one at a time.
   *
   * @default false
   */
  cumulative?: boolean | undefined;
  /**
   * How layers that aren't currently active are displayed.
   * - `hide`: inactive layers are invisible.
   * - `dim`: inactive layers stay visible but faded.
   *
   * Defaults to the symbol's standard appearance when unset.
   */
  inactiveLayers?: SFSymbolInactiveLayers | undefined;
};

type SFSymbolEffectConfig =
  | SFSymbolDirectionalEffectConfig
  | SFSymbolScaleEffectConfig
  | SFSymbolBasicScopedEffectConfig
  | SFSymbolBreatheEffectConfig
  | SFSymbolWiggleEffectConfig
  | SFSymbolRotateEffectConfig
  | SFSymbolDrawEffectConfig
  | SFSymbolDrawOffEffectConfig
  | SFSymbolVariableColorEffectConfig;

export type SFSymbolContentTransitionScope = 'byLayer' | 'wholeSymbol';

export type SFSymbolReplaceTransitionVariant = 'downUp' | 'upUp' | 'offUp';

type SFSymbolContentTransitionBaseConfig = {
  /**
   * Speed multiplier for the transition.
   *
   * @default 1
   */
  speed?: number | undefined;
};

type SFSymbolContentTransitionConfig =
  | (SFSymbolContentTransitionBaseConfig & {
      /**
       * The transition effect to apply when the symbol `name` or `variableValue` changes.
       */
      type: 'automatic';
    })
  | (SFSymbolContentTransitionBaseConfig & {
      /**
       * The transition effect to apply when the symbol `name` or `variableValue` changes.
       */
      type: 'replace';
      /**
       * The direction the outgoing and incoming symbols move.
       * - `downUp`: the old symbol slides down, the new one comes up.
       * - `upUp`: both the old and new symbols move up.
       * - `offUp`: the old symbol fades in place, the new one comes up.
       */
      variant?: SFSymbolReplaceTransitionVariant | undefined;
      /**
       * Whether to transition the whole symbol at once or by layer.
       *
       * @default 'byLayer'
       */
      scope?: SFSymbolContentTransitionScope | undefined;
      /**
       * Whether to prefer Magic Replace when possible.
       *
       * Falls back to regular Replace on iOS 17.
       *
       * @default false
       */
      magic?: boolean | undefined;
    });

type SFSymbolEffect = SFSymbolEffectName | SFSymbolEffectConfig;

type SFSymbolContentTransition =
  | SFSymbolContentTransitionEffect
  | SFSymbolContentTransitionConfig;

type SFSymbolVariableValueMode = 'automatic' | 'color' | 'draw';

type SFSymbolColorRenderingMode = 'automatic' | 'flat' | 'gradient';

export type SFSymbolOptions = {
  /**
   * The name of the SF Symbol to display.
   */
  name: import('sf-symbols-typescript').SFSymbol | keyof SFSymbolNames;
  /**
   * The size of the symbol.
   *
   * @default 24
   */
  size?: number | undefined;
  /**
   * The color of the symbol.
   * Used as the tint color in monochrome mode, and as the fallback for
   * `colors.primary` in hierarchical and palette modes.
   *
   * @default 'black'
   */
  color?: ColorValue | undefined;
  /**
   * The weight of the symbol.
   *
   * @default 'regular'
   */
  weight?:
    | keyof typeof FONT_WEIGHTS
    | (typeof FONT_WEIGHTS)[keyof typeof FONT_WEIGHTS]
    | undefined;
  /**
   * The symbol's scale variant (`small`, `medium`, or `large`).
   *
   * @default 'medium'
   */
  scale?: SFSymbolScale | undefined;
  /**
   * The value used to customize variable symbols.
   * Must be between `0` and `1`.
   *
   * Variable symbols (e.g. `wifi`, `speaker.wave.3`) have layers that
   * activate progressively to represent a magnitude. This controls how
   * many are shown: `0` renders the fewest, `1` the full symbol.
   *
   * Has no effect on symbols that aren't variable.
   */
  variableValue?: number | undefined;
  /**
   * How the partial state from `variableValue` is rendered.
   * - `automatic`: the system chooses based on the symbol.
   * - `color`: fades inactive layers using opacity.
   * - `draw`: partially draws layers instead of fading them.
   *
   * Requires iOS 26+. Ignored on earlier versions.
   *
   * @default 'automatic'
   */
  variableValueMode?: SFSymbolVariableValueMode | undefined;
  /**
   * The rendering mode of the symbol.
   * - `monochrome`: Single color tint (default).
   * - `hierarchical`: Derived hierarchy from a single color.
   * - `palette`: Explicit colors for each layer.
   * - `multicolor`: Uses the symbol's built-in multicolor scheme.
   *
   * @default 'monochrome'
   */
  renderingMode?: SFSymbolRenderingMode | undefined;
  /**
   * The colors for non-monochrome rendering modes.
   * - `hierarchical`: uses `primary` as the base color.
   * - `palette`: uses `primary`, `secondary`, and `tertiary` for each layer.
   * - `multicolor`: ignored.
   *
   * Falls back to `color` for `primary` if not specified.
   */
  colors?:
    | {
        primary?: ColorValue | undefined;
        secondary?: ColorValue | undefined;
        tertiary?: ColorValue | undefined;
      }
    | undefined;
  /**
   * How color is applied across the symbol's layers.
   * - `automatic`: the system chooses based on the symbol.
   * - `flat`: a solid color per layer.
   * - `gradient`: a gradient derived from each layer's color.
   *
   * Requires iOS 26+. Ignored on earlier versions.
   *
   * @default 'automatic'
   */
  colorRenderingMode?: SFSymbolColorRenderingMode | undefined;
  /**
   * The effect to apply to the symbol.
   *
   * Requires iOS 17+. Effects introduced in later iOS versions are ignored
   * on earlier versions.
   */
  effect?: SFSymbolEffect | undefined;
  /**
   * The content transition to apply when the symbol `name` or `variableValue` changes.
   *
   * Requires iOS 17+. Ignored on earlier versions.
   */
  contentTransition?: SFSymbolContentTransition | undefined;
};
