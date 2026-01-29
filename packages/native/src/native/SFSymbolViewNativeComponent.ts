/* eslint-disable import-x/no-default-export */

import {
  codegenNativeComponent,
  CodegenTypes,
  type ColorValue,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  name: string;
  size: CodegenTypes.Float;
  color?: ColorValue;
  weight: CodegenTypes.Int32;
  scale: string;
  mode: string;
  colorPrimary?: ColorValue;
  colorSecondary?: ColorValue;
  colorTertiary?: ColorValue;
  animation: string;
  animationRepeating: boolean;
  animationRepeatCount: CodegenTypes.Int32;
  animationSpeed: CodegenTypes.Float;
  animationWholeSymbol: boolean;
  animationDirection: string;
  animationReversing: boolean;
  animationCumulative: boolean;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationSFSymbolView'
);
