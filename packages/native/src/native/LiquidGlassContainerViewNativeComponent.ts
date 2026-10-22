import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  spacing?: CodegenTypes.Float | undefined;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationLiquidGlassContainerView',
  {
    excludedPlatforms: ['android'],
  }
);
