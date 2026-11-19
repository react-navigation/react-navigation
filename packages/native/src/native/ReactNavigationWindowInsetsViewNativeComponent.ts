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
  types: readonly string[];
  ignoreVisibility?: CodegenTypes.WithDefault<boolean, false>;
  hasInsetsChangeListener?: CodegenTypes.WithDefault<boolean, false>;
  edges?:
    | Readonly<{
        top?: EdgeMode;
        bottom?: EdgeMode;
        start?: EdgeMode;
        end?: EdgeMode;
      }>
    | undefined;
  onInsetsChange?:
    | CodegenTypes.DirectEventHandler<InsetsChangeEvent>
    | undefined;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationWindowInsetsView',
  {
    excludedPlatforms: ['iOS'],
    interfaceOnly: true,
  }
);
