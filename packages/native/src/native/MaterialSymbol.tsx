import type { ImageSourcePropType, ViewStyle } from 'react-native';

import type {
  MaterialSymbolImageSourceOptions,
  MaterialSymbolOptions,
} from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & {
  /**
   * Style object for the symbol.
   */
  style?: ViewStyle | undefined;
};

export function MaterialSymbol(_: MaterialSymbolProps): React.ReactElement {
  throw new Error('MaterialSymbol is only supported on Android.');
}

MaterialSymbol.isAvailable = (): boolean => {
  return false;
};

MaterialSymbol.getImageSource = (
  _: MaterialSymbolImageSourceOptions
): ImageSourcePropType => {
  throw new Error(
    'MaterialSymbol.getImageSource is only supported on Android.'
  );
};
