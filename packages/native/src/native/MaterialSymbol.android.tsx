import {
  type ImageSourcePropType,
  PixelRatio,
  processColor,
  type ViewProps,
} from 'react-native';

import { MATERIAL_SYMBOL_FONT_HASHES } from './MaterialSymbolData';
import MaterialSymbolViewNativeComponent from './MaterialSymbolViewNativeComponent';
import NativeMaterialSymbolModule from './NativeMaterialSymbolModule';
import type { MaterialSymbolOptions } from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & ViewProps;

const imageSourceCache = new Map<string, ImageSourcePropType>();

export function MaterialSymbol({
  name,
  size = 24,
  color = 'black',
  style,
  ...rest
}: MaterialSymbolProps): React.ReactElement {
  const variant = 'outlined';
  const weight = 400;

  return (
    <MaterialSymbolViewNativeComponent
      name={name}
      variant={variant}
      weight={weight}
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
  size = 24,
  color = 'black',
}: MaterialSymbolOptions): ImageSourcePropType => {
  const variant = 'outlined';
  const weight = 400;

  const hash = MATERIAL_SYMBOL_FONT_HASHES[`${variant}-${weight}`];
  const processedColor = processColor(color);

  if (processedColor == null) {
    throw new Error(`Invalid color value: ${String(color)}`);
  }

  const scale = PixelRatio.get();

  const cacheKey = `${name}:${variant}:${weight}:${size}:${scale}:${JSON.stringify(processedColor)}:${hash}`;
  const cached = imageSourceCache.get(cacheKey);

  if (cached !== undefined) {
    return cached;
  }

  const uri = NativeMaterialSymbolModule.getImageSource(
    name,
    variant,
    size,
    weight,
    { value: processedColor },
    hash
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
