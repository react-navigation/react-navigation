import {
  type ImageSourcePropType,
  PixelRatio,
  PlatformColor,
  processColor,
  type ViewProps,
} from 'react-native';

import { FONT_WEIGHTS } from './constants';
import MaterialSymbolViewNativeComponent from './MaterialSymbolViewNativeComponent';
import NativeMaterialSymbolModule from './NativeMaterialSymbolModule';
import type { MaterialSymbolOptions } from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & ViewProps;

const imageSourceCache = new Map<string, ImageSourcePropType>();

const DEFAULT_COLOR = PlatformColor('?attr/colorForeground');

export function MaterialSymbol({
  name,
  weight,
  size = 24,
  color = DEFAULT_COLOR,
  style,
  ...rest
}: MaterialSymbolProps): React.ReactElement {
  return (
    <MaterialSymbolViewNativeComponent
      name={name}
      weight={typeof weight === 'string' ? FONT_WEIGHTS[weight] : (weight ?? 0)}
      size={size}
      color={color}
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

MaterialSymbol.getImageSource = ({
  name,
  variant,
  weight,
  size = 24,
  color = 'black',
}: MaterialSymbolOptions): ImageSourcePropType => {
  const processedColor = processColor(color);

  if (processedColor == null) {
    throw new Error(`Invalid color value: ${String(color)}`);
  }

  const scale = PixelRatio.get();

  const cacheKey = `${name}:${variant}:${weight}:${size}:${scale}:${JSON.stringify(processedColor)}`;
  const cached = imageSourceCache.get(cacheKey);

  if (cached !== undefined) {
    return cached;
  }

  const uri = NativeMaterialSymbolModule.getImageSource(
    name,
    variant,
    typeof weight === 'string' ? FONT_WEIGHTS[weight] : weight,
    size,
    { value: processedColor }
  );

  const source: ImageSourcePropType = {
    uri,
    scale,
    width: size,
    height: size,
  };

  imageSourceCache.set(cacheKey, source);

  return source;
};
