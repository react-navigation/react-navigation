/* eslint-disable import-x/extensions */

import type { SFSymbolProps } from './SFSymbol.tsx';
import SFSymbolViewNativeComponent from './SFSymbolViewNativeComponent';

export function SFSymbol({
  name,
  size = 24,
  color = 'black',
}: SFSymbolProps): React.ReactElement {
  return (
    <SFSymbolViewNativeComponent
      name={name}
      size={size}
      color={color}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}
