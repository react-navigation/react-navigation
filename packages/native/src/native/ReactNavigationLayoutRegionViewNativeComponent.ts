/* eslint-disable import-x/no-default-export */
import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

type InsetsChangeEvent = Readonly<{
  insets: {
    top: CodegenTypes.Double;
    bottom: CodegenTypes.Double;
    start: CodegenTypes.Double;
    end: CodegenTypes.Double;
  };
}>;

type EdgeMode = CodegenTypes.WithDefault<'off' | 'additive' | 'maximum', 'off'>;

export interface NativeProps extends ViewProps {
  region?: CodegenTypes.WithDefault<
    'safeArea' | 'readableContent' | 'bar',
    'safeArea'
  >;
  cornerAdaptation?: CodegenTypes.WithDefault<
    'none' | 'horizontal' | 'vertical',
    'none'
  >;
  cornerAdaptationOnly?: CodegenTypes.WithDefault<boolean, false>;
  onEdge?: CodegenTypes.WithDefault<'top' | 'bottom' | 'start' | 'end', 'top'>;
  extent?: CodegenTypes.WithDefault<CodegenTypes.Double, 0>;
  edges?:
    | Readonly<{
        top?: EdgeMode;
        bottom?: EdgeMode;
        start?: EdgeMode;
        end?: EdgeMode;
      }>
    | undefined;
  hasInsetsChangeListener?: CodegenTypes.WithDefault<boolean, false>;
  onInsetsChange?:
    | CodegenTypes.DirectEventHandler<InsetsChangeEvent>
    | undefined;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationLayoutRegionView',
  {
    excludedPlatforms: ['android'],
    interfaceOnly: true,
  }
);
