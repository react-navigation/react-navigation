import type { ColorValue } from 'react-native';

export type SFSymbolProps = {
  /**
   * The name of the SF Symbol to display.
   */
  name: import('sf-symbols-typescript').SFSymbol;
  /**
   * The size of the symbol.
   * @default 24
   */
  size?: number;
  /**
   * The color of the symbol.
   * @default 'black'
   */
  color?: ColorValue;
};

export function SFSymbol(_: SFSymbolProps): React.ReactElement {
  throw new Error('SFSymbol is only supported on iOS.');
}
