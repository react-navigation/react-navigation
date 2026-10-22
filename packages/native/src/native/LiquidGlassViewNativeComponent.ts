import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  interactive?: boolean | undefined;
  colorScheme?: CodegenTypes.WithDefault<'light' | 'dark' | 'system', 'system'>;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationLiquidGlassView',
  {
    excludedPlatforms: ['android'],
  }
);
