/* eslint-disable import-x/no-default-export */

import {
  codegenNativeComponent,
  CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  direction?: CodegenTypes.WithDefault<'vertical' | 'horizontal', 'vertical'>;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationCornerInsetView',
  {
    interfaceOnly: true,
  }
);
