// Project: https://github.com/kmagiera/react-native-screens
// TypeScript Version: 2.8

declare module 'react-native-screens' {
  import { ComponentClass } from 'react';
  import { ViewProps, Animated } from 'react-native';

  export function useScreens(shouldUseScreens?: boolean): void;
  export function enableScreens(shouldEnableScreens?: boolean): void;
  export function screensEnabled(): boolean;

  export interface ScreenProps extends ViewProps {
    active?: 0 | 1 | Animated.AnimatedInterpolation;
    onComponentRef?: (view: any) => void;
  }
  export const Screen: ComponentClass<ScreenProps>;

  export type ScreenContainerProps = ViewProps;
  export const ScreenContainer: ComponentClass<ScreenContainerProps>;

  export const NativeScreen: ComponentClass<ScreenProps>;
  export const NativeScreenContainer: ComponentClass<ScreenContainerProps>;
}
