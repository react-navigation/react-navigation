import {
  type ImageSourcePropType,
  PixelRatio,
  processColor,
  type ViewProps,
} from 'react-native';

import { FONT_WEIGHTS } from './constants';
import MaterialSymbolViewNativeComponent from './MaterialSymbolViewNativeComponent';
import NativeMaterialSymbolModule from './NativeMaterialSymbolModule';
import type { MaterialSymbolOptions } from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & ViewProps;

export function MaterialSymbol({
  name,
  weight,
  size = 24,
  color,
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

  const uri = NativeMaterialSymbolModule.getImageSource(
    name,
    variant,
    typeof weight === 'string' ? FONT_WEIGHTS[weight] : weight,
    size,
    { value: processedColor }
  );

  const source: ImageSourcePropType = {
    uri,
    scale: PixelRatio.get(),
    width: size,
    height: size,
  };

  return source;
};
