/* eslint-disable import-x/no-default-export */
import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

type RegionsChangeEvent = Readonly<{
  regions: {
    frame: {
      x: CodegenTypes.Double;
      y: CodegenTypes.Double;
      width: CodegenTypes.Double;
      height: CodegenTypes.Double;
    };
    margins: {
      top: CodegenTypes.Double;
      right: CodegenTypes.Double;
      bottom: CodegenTypes.Double;
      left: CodegenTypes.Double;
    };
    active: boolean;
  }[];
}>;

export interface NativeProps extends ViewProps {
  kind?: CodegenTypes.WithDefault<'occlusion' | 'division', 'occlusion'>;
  includeInactive?: CodegenTypes.WithDefault<boolean, false>;
  onRegionsChange?: CodegenTypes.DirectEventHandler<RegionsChangeEvent>;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationReservedRegionsView',
  {
    excludedPlatforms: ['android'],
  }
);
