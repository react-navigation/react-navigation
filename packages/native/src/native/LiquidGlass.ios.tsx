import type { HostComponent } from 'react-native';

import type {
  LiquidGlassContainerViewProps,
  LiquidGlassViewProps,
  // eslint-disable-next-line import-x/extensions
} from './LiquidGlass.tsx';
import LiquidGlassContainerViewNativeComponent from './LiquidGlassContainerViewNativeComponent';
import LiquidGlassViewNativeComponent from './LiquidGlassViewNativeComponent';
import NativeReactNavigationLiquidGlassModule from './NativeReactNavigationLiquidGlassModule';

export const LiquidGlassView: HostComponent<LiquidGlassViewProps> =
  LiquidGlassViewNativeComponent;

export const LiquidGlassContainerView: HostComponent<LiquidGlassContainerViewProps> =
  LiquidGlassContainerViewNativeComponent;

export const isLiquidGlassSupported: boolean =
  NativeReactNavigationLiquidGlassModule?.isSupported() ?? false;
