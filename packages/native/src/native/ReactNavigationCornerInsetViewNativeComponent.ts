/* eslint-disable import-x/no-default-export */
import * as React from 'react';
import {
  codegenNativeCommands,
  codegenNativeComponent,
  CodegenTypes,
  type HostComponent,
  type ViewProps,
} from 'react-native';

export interface NativeProps extends ViewProps {
  direction?: CodegenTypes.WithDefault<'vertical' | 'horizontal', 'vertical'>;
  edge?: CodegenTypes.WithDefault<'top' | 'right' | 'bottom' | 'left', 'top'>;
}

interface NativeCommands {
  // FIXME: codegen fails with ComponentRef
  // so we currently use the deprecated ElementRef
  relayout(viewRef: React.ElementRef<HostComponent<NativeProps>>): void;
}

export const Commands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['relayout'],
});

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationCornerInsetView',
  {
    interfaceOnly: true,
  }
) as HostComponent<NativeProps>;
