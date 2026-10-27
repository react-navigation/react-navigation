/* eslint-disable import-x/no-default-export */
import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  edge?: CodegenTypes.WithDefault<'top' | 'right' | 'bottom' | 'left', 'top'>;
  cornerAdaptation?: CodegenTypes.WithDefault<
    'vertical' | 'horizontal',
    'vertical'
  >;
  collapseUnlessAdapted?: CodegenTypes.WithDefault<boolean, false>;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationLayoutInsetView',
  {
    excludedPlatforms: ['android'],
    interfaceOnly: true,
  }
);
