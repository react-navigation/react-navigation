/* eslint-disable import-x/no-default-export */

import {
  codegenNativeComponent,
  CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  routeKey: string;
  triggerId: string;
  hasAlignmentRect: boolean;
  alignmentRectX: CodegenTypes.Float;
  alignmentRectY: CodegenTypes.Float;
  alignmentRectWidth: CodegenTypes.Float;
  alignmentRectHeight: CodegenTypes.Float;
}

export default codegenNativeComponent<NativeProps>('ReactNavigationZoomAnchor');
