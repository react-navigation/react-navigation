import type { ColorValue } from 'react-native';

import type { MaterialSymbolName } from './MaterialSymbolData';

type MaterialSymbolVariant = 'outlined' | 'rounded' | 'sharp';

export type MaterialSymbolOptions = {
  /**
   * The name of the Material Symbol to display.
   */
  name: MaterialSymbolName;
  /**
   * The variant of the symbol.
   *
   * @default 'outlined'
   */
  variant?: MaterialSymbolVariant;
  /**
   * The size of the symbol.
   *
   * @default 24
   */
  size?: number;
  /**
   * The color of the symbol.
   *
   * @default 'black'
   */
  color?: ColorValue;
};

export type SFSymbolOptions = {
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
