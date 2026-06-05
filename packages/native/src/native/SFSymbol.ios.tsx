import type { ViewProps } from 'react-native';

import { FONT_WEIGHTS } from './constants';
import SFSymbolViewNativeComponent from './SFSymbolViewNativeComponent';
import type {
  SFSymbolBreatheVariant,
  SFSymbolContentTransitionEffect,
  SFSymbolContentTransitionScope,
  SFSymbolDrawDirection,
  SFSymbolEffectDirection,
  SFSymbolEffectName,
  SFSymbolEffectRepeat,
  SFSymbolEffectScope,
  SFSymbolInactiveLayers,
  SFSymbolOptions,
  SFSymbolReplaceTransitionVariant,
} from './types';

export type SFSymbolProps = SFSymbolOptions & ViewProps;

type NativeEffectConfig = {
  type: SFSymbolEffectName;
  speed?: number | undefined;
  repeat?: SFSymbolEffectRepeat | undefined;
  scope?: SFSymbolEffectScope | undefined;
  direction?: SFSymbolEffectDirection | undefined;
  variant?: SFSymbolBreatheVariant | undefined;
  angle?: number | undefined;
  reversing?: boolean | undefined;
  cumulative?: boolean | undefined;
  inactiveLayers?: SFSymbolInactiveLayers | undefined;
  drawDirection?: SFSymbolDrawDirection | undefined;
};

type NativeContentTransitionConfig = {
  type: SFSymbolContentTransitionEffect;
  speed?: number | undefined;
  variant?: SFSymbolReplaceTransitionVariant | undefined;
  scope?: SFSymbolContentTransitionScope | undefined;
  magic?: boolean | undefined;
};

export function SFSymbol({
  name,
  size = 24,
  color,
  weight,
  scale = 'medium',
  variableValue,
  variableValueMode = 'automatic',
  colorRenderingMode = 'automatic',
  renderingMode = 'monochrome',
  colors,
  effect,
  contentTransition,
  style,
  ...rest
}: SFSymbolProps): React.ReactElement {
  const effectConfig: NativeEffectConfig | undefined =
    typeof effect === 'string' ? { type: effect } : effect;
  const contentTransitionConfig: NativeContentTransitionConfig | undefined =
    typeof contentTransition === 'string'
      ? { type: contentTransition }
      : contentTransition;

  const repeat = effectConfig?.repeat;

  return (
    <SFSymbolViewNativeComponent
      name={name}
      size={size}
      color={color}
      weight={typeof weight === 'string' ? FONT_WEIGHTS[weight] : (weight ?? 0)}
      scale={scale}
      variableValue={variableValue ?? -1}
      variableValueMode={variableValueMode}
      colorRenderingMode={colorRenderingMode}
      renderingMode={renderingMode}
      colorPrimary={colors?.primary ?? color}
      colorSecondary={colors?.secondary}
      colorTertiary={colors?.tertiary}
      effect={effectConfig?.type ?? ''}
      effectRepeat={
        typeof repeat === 'string' ? repeat : repeat ? 'periodic' : ''
      }
      effectRepeatCount={typeof repeat === 'object' ? (repeat.count ?? 0) : 0}
      effectRepeatDelay={typeof repeat === 'object' ? (repeat.delay ?? 0) : 0}
      effectSpeed={effectConfig?.speed ?? 1}
      effectScope={effectConfig?.scope ?? ''}
      effectDirection={effectConfig?.direction ?? ''}
      effectVariant={effectConfig?.variant ?? ''}
      effectAngle={effectConfig?.angle ?? -1}
      effectReversing={effectConfig?.reversing ?? false}
      effectCumulative={effectConfig?.cumulative ?? false}
      effectInactiveLayers={effectConfig?.inactiveLayers ?? ''}
      effectDrawDirection={effectConfig?.drawDirection ?? ''}
      contentTransition={contentTransitionConfig?.type ?? ''}
      contentTransitionSpeed={contentTransitionConfig?.speed ?? 1}
      contentTransitionVariant={contentTransitionConfig?.variant ?? ''}
      contentTransitionScope={contentTransitionConfig?.scope ?? ''}
      contentTransitionMagic={contentTransitionConfig?.magic ?? false}
      style={[
        {
          width: size,
          height: size,
        },
        style,
      ]}
      {...rest}
    />
  );
}
