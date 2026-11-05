/* eslint-disable import-x/no-default-export */
import {
  codegenNativeComponent,
  type CodegenTypes,
  type ViewProps,
} from 'react-native';

type RegionsChangeEvent = Readonly<{
  regions: {
    id: CodegenTypes.Int32;
    kind: 'occlusion' | 'division';
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
  size: {
    width: CodegenTypes.Double;
    height: CodegenTypes.Double;
  };
}>;

export interface NativeProps extends ViewProps {
  onRegionsChange?:
    | CodegenTypes.DirectEventHandler<RegionsChangeEvent>
    | undefined;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationReservedRegionsView',
  {
    excludedPlatforms: ['android'],
  }
);
