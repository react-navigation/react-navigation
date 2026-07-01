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
  color?: ColorValue | undefined;
  weight: CodegenTypes.Int32;
  scale: string;
  variableValue: CodegenTypes.Float;
  variableValueMode: string;
  colorRenderingMode: string;
  renderingMode: string;
  colorPrimary?: ColorValue | undefined;
  colorSecondary?: ColorValue | undefined;
  colorTertiary?: ColorValue | undefined;
  effect: string;
  effectRepeat: string;
  effectRepeatCount: CodegenTypes.Int32;
  effectRepeatDelay: CodegenTypes.Float;
  effectSpeed: CodegenTypes.Float;
  effectScope: string;
  effectDirection: string;
  effectVariant: string;
  effectAngle: CodegenTypes.Float;
  effectReversing: boolean;
  effectCumulative: boolean;
  effectInactiveLayers: string;
  effectDrawDirection: string;
  contentTransition: string;
  contentTransitionSpeed: CodegenTypes.Float;
  contentTransitionVariant: string;
  contentTransitionScope: string;
  contentTransitionMagic: boolean;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationSFSymbolView'
);
