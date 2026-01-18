import { type ImageSourcePropType, type ViewProps } from 'react-native';

import type { MaterialSymbolOptions } from './types';

export type MaterialSymbolProps = MaterialSymbolOptions & ViewProps;

export function MaterialSymbol(_: MaterialSymbolProps): React.ReactElement {
  throw new Error('MaterialSymbol is only supported on Android.');
}

MaterialSymbol.getImageSource = (
  _: MaterialSymbolOptions
): ImageSourcePropType => {
  throw new Error(
    'MaterialSymbol.getImageSource is only supported on Android.'
  );
};
