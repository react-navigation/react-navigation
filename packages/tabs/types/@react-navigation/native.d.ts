declare module '@react-navigation/native' {
  import { ComponentType } from 'react';
  import { StyleProp, ViewStyle, ViewProps } from 'react-native';

  export function createAppContainer<Props>(
    Comp: React.ComponentType<Props>
  ): React.ComponentType<Props>;

  export function withOrientation<Props extends { isLandscape: boolean }>(
    Comp: React.ComponentType<Props>
  ): React.ComponentType<Pick<Props, Exclude<keyof Props, 'isLandscape'>>>;

  export function createKeyboardAwareNavigator<Props>(
    Comp: React.ComponentType<Props>,
    stackConfig: object
  ): React.ComponentType<Props>;

  export type SafeAreaViewForceInsetValue = 'always' | 'never';

  export const SafeAreaView: ComponentType<
    ViewProps & {
      forceInset?: {
        top?: SafeAreaViewForceInsetValue;
        bottom?: SafeAreaViewForceInsetValue;
        left?: SafeAreaViewForceInsetValue;
        right?: SafeAreaViewForceInsetValue;
        horizontal?: SafeAreaViewForceInsetValue;
        vertical?: SafeAreaViewForceInsetValue;
      };
    }
  >;
}
