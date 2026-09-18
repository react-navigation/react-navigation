import type { ImageSourcePropType, ViewStyle } from 'react-native';

import type { MaterialSymbolOptions } from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & {
  /**
   * Style object for the symbol.
   */
  style?: (React.CSSProperties & ViewStyle) | undefined;
};

export function MaterialSymbol(_: MaterialSymbolProps): React.ReactElement {
  throw new Error('MaterialSymbol is only supported on Android and Web.');
}

MaterialSymbol.getImageSource = (
  _: MaterialSymbolOptions
): ImageSourcePropType => {
  throw new Error(
    'MaterialSymbol.getImageSource is only supported on Android.'
  );
};
