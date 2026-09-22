import type { ViewStyle } from 'react-native';

import type { SFSymbolOptions } from './types';

export type SFSymbolProps = SFSymbolOptions & {
  /**
   * Style object for the symbol.
   */
  style?: ViewStyle | undefined;
};

export function SFSymbol(_: SFSymbolProps): React.ReactElement {
  throw new Error('SFSymbol is only supported on iOS.');
}
