/* eslint-disable import-x/no-default-export */

import {
  codegenNativeComponent,
  CodegenTypes,
  type ColorValue,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  name: string;
  variant: string;
  weight?: CodegenTypes.WithDefault<
    100 | 200 | 300 | 400 | 500 | 600 | 700,
    400
  >;
  size: CodegenTypes.Float;
  color: ColorValue;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationMaterialSymbolView'
);
