/* eslint-disable import-x/no-default-export */
import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  insets?:
    | Readonly<{
        top?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
        bottom?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
        start?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
        end?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
      }>
    | undefined;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationSafeAreaInsetsProvider',
  {
    excludedPlatforms: ['android'],
  }
);
