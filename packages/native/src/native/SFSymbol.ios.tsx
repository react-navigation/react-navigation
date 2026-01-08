/* eslint-disable import-x/extensions */

import ReactNavigationSFSymbolView from './ReactNavigationSFSymbolViewNativeComponent';
import type { SFSymbolProps } from './SFSymbol.tsx';

export function SFSymbol({
  name,
  size = 24,
  color = 'black',
}: SFSymbolProps): React.ReactElement {
  return (
    <ReactNavigationSFSymbolView
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
