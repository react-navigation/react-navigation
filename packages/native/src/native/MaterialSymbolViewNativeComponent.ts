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
  size: CodegenTypes.Float;
  color: ColorValue;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationMaterialSymbolView'
);
