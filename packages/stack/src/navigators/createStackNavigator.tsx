import * as React from 'react';
import { Platform } from 'react-native';
import {
  useNavigationBuilder,
  createNavigatorFactory,
  DefaultNavigatorOptions,
  EventArg,
  StackRouter,
  StackRouterOptions,
  StackNavigationState,
  StackActions,
  ParamListBase,
  StackActionHelpers,
} from '@react-navigation/native';
import warnOnce from 'warn-once';
import StackView from '../views/Stack/StackView';
import type {
  StackNavigationConfig,
  StackNavigationOptions,
  StackNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<StackNavigationOptions> &
  StackRouterOptions &
  StackNavigationConfig;

function StackNavigator({
  initialRouteName,
  children,
  screenOptions,
  ...rest
}: Props) {
  // @ts-expect-error: headerMode='none' is deprecated
  const isHeaderModeNone = rest.headerMode === 'none';

  warnOnce(
    isHeaderModeNone,
    `Stack Navigator: 'headerMode="none"' is deprecated. Use 'headerShown: false' in 'screenOptions' instead.`
  );

  const { state, descriptors, navigation } = useNavigationBuilder<
    StackNavigationState<ParamListBase>,
    StackRouterOptions,
    StackActionHelpers<ParamListBase>,
    StackNavigationOptions,
    StackNavigationEventMap
  >(StackRouter, {
    initialRouteName,
    children,
    screenOptions,
    defaultScreenOptions: {
      headerShown: !isHeaderModeNone,
      gestureEnabled: Platform.OS === 'ios',
      animationEnabled:
        Platform.OS !== 'web' &&
        Platform.OS !== 'windows' &&
        Platform.OS !== 'macos',
    },
  });

  React.useEffect(
    () =>
      navigation.addListener?.('tabPress', (e) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as EventArg<'tabPress', true>).defaultPrevented
          ) {
            // When user taps on already focused tab and we're inside the tab,
            // reset the stack to replicate native behaviour
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }),
    [navigation, state.index, state.key]
  );

  return (
    <StackView
      {...rest}
      state={state}
      descriptors={descriptors}
      navigation={navigation}
    />
  );
}

export default createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  typeof StackNavigator
>(StackNavigator);
