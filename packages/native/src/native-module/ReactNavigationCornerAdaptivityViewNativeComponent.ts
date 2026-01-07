import {
  codegenNativeComponent,
  type HostComponent,
  type ViewProps,
} from 'react-native';

export type CornerAdaptivityDirection = 'vertical' | 'horizontal';

export interface NativeProps extends ViewProps {
  direction: CornerAdaptivityDirection;
}

export const ReactNavigationCornerAdaptivityView =
  codegenNativeComponent<NativeProps>('ReactNavigationCornerAdaptivityView', {
    interfaceOnly: true,
  }) as HostComponent<NativeProps>;
