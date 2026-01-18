import type { ViewProps } from 'react-native';

import SFSymbolViewNativeComponent from './SFSymbolViewNativeComponent';
import type { SFSymbolOptions } from './types';

export type SFSymbolProps = SFSymbolOptions & ViewProps;

export function SFSymbol({
  name,
  size = 24,
  color = 'black',
  style,
  ...rest
}: SFSymbolProps): React.ReactElement {
  return (
    <SFSymbolViewNativeComponent
      name={name}
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
