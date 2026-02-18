/* eslint-disable import-x/no-default-export */

import { codegenNativeComponent, type ViewProps } from 'react-native';

export interface NativeProps extends ViewProps {
  routeKey: string;
}

export default codegenNativeComponent<NativeProps>(
  'ReactNavigationZoomTransitionEnabler'
);
