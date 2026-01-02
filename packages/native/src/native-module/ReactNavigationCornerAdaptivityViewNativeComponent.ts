import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';
import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

export type CornerAdaptivityDirection = 'vertical' | 'horizontal';

export interface NativeProps extends ViewProps {
  direction?: WithDefault<CornerAdaptivityDirection, 'vertical'>;
}

// eslint-disable-next-line import-x/no-default-export
export default codegenNativeComponent<NativeProps>(
  'ReactNavigationCornerAdaptivityView',
  {
    interfaceOnly: true,
  }
) as HostComponent<NativeProps>;
