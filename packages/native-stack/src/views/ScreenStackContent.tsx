import {
  Screen,
  type ScreenProps,
  ScreenStackHeaderConfig,
  type ScreenStackHeaderConfigProps,
} from 'react-native-screens';

type Props = Omit<ScreenProps, 'enabled' | 'isNativeStack'> & {
  headerConfig?: ScreenStackHeaderConfigProps;
};

export function ScreenStackContent({ children, headerConfig, ...rest }: Props) {
  return (
    <Screen enabled isNativeStack {...rest}>
      {children}
      {/**
       * `HeaderConfig` needs to be the direct child of `Screen` without any intermediate `View`
       * We don't render it conditionally to make it possible to dynamically render a custom `header`
       * Otherwise dynamically rendering a custom `header` leaves the native header visible
       *
       * https://github.com/software-mansion/react-native-screens/blob/main/guides/GUIDE_FOR_LIBRARY_AUTHORS.md#screenstackheaderconfig
       *
       * HeaderConfig must not be first child of a Screen.
       * See https://github.com/software-mansion/react-native-screens/pull/1825
       * for detailed explanation.
       */}
      <ScreenStackHeaderConfig {...headerConfig} />
    </Screen>
  );
}
