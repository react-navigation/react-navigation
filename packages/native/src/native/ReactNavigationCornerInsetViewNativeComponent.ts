/* eslint-disable import-x/no-default-export */
import * as React from 'react';
import {
  codegenNativeCommands,
  codegenNativeComponent,
  type CodegenTypes,
  type HostComponent,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  direction?: CodegenTypes.WithDefault<'vertical' | 'horizontal', 'vertical'>;
  edge?: CodegenTypes.WithDefault<'top' | 'right' | 'bottom' | 'left', 'top'>;
  adaptive?: CodegenTypes.WithDefault<boolean, true>;
}

interface NativeCommands {
  relayout(viewRef: React.ComponentRef<HostComponent<NativeProps>>): void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['relayout'],
});

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationCornerInsetView',
  {
    excludedPlatforms: ['android'],
    interfaceOnly: true,
  }
);
