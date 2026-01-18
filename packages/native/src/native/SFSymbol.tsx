import type { ViewProps } from 'react-native';

import type { SFSymbolOptions } from './types';

export type SFSymbolProps = SFSymbolOptions & ViewProps;

export function SFSymbol(_: SFSymbolProps): React.ReactElement {
  throw new Error('SFSymbol is only supported on iOS.');
}
