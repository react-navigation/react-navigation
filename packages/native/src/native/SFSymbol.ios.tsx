import type { ViewProps } from 'react-native';

import SFSymbolViewNativeComponent from './SFSymbolViewNativeComponent';
import type { SFSymbolOptions } from './types';

export type SFSymbolProps = SFSymbolOptions & ViewProps;

const WEIGHT_MAPPING = {
  thin: 100,
  extralight: 200,
  ultralight: 200,
  light: 300,
  normal: 400,
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
  black: 900,
} as const;

export function SFSymbol({
  name,
  size = 24,
  color,
  weight,
  scale = 'medium',
  mode = 'monochrome',
  colors,
  animation,
  style,
  ...rest
}: SFSymbolProps): React.ReactElement {
  const animConfig =
    typeof animation === 'string' ? { effect: animation } : animation;

  return (
    <SFSymbolViewNativeComponent
      name={name}
      size={size}
      color={color}
      weight={
        typeof weight === 'string' ? WEIGHT_MAPPING[weight] : (weight ?? 0)
      }
      scale={scale}
      mode={mode}
      colorPrimary={colors?.primary ?? color}
      colorSecondary={colors?.secondary}
      colorTertiary={colors?.tertiary}
      animation={animConfig?.effect ?? ''}
      animationRepeating={animConfig?.repeating ?? false}
      animationRepeatCount={animConfig?.repeatCount ?? 0}
      animationSpeed={animConfig?.speed ?? 1}
      animationWholeSymbol={animConfig?.wholeSymbol ?? false}
      animationDirection={animConfig?.direction ?? ''}
      animationReversing={animConfig?.reversing ?? false}
      animationCumulative={animConfig?.cumulative ?? false}
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
