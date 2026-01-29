import {
  type ImageSourcePropType,
  PixelRatio,
  processColor,
  type ViewProps,
} from 'react-native';

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
  return (
    <MaterialSymbolViewNativeComponent
      name={name}
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
  const variant = undefined;
  const weight = undefined;

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
    weight,
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
