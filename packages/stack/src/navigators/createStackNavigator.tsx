import {
  createNavigatorFactory,
  createStaticScreenFactory,
  type EventArg,
  type NavigatorTypeBagFactory,
  type ParamListBase,
  type StackActionHelpers,
  StackActions,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  useLocale,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackNavigatorProps,
} from '../types';
import { StackView } from '../views/Stack/StackView';

function StackNavigator({
  initialRouteName,
  routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: StackNavigatorProps) {
  const { direction } = useLocale();

  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      StackNavigationOptions,
      StackNavigationEventMap
    >(StackRouter, {
      initialRouteName,
      routeNamesChangeBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      router,
    });

  React.useEffect(
    () =>
      // @ts-expect-error: there may not be a tab navigator in parent
      navigation.addListener?.('tabPress', (e) => {
        const isFocused = navigation.isFocused();

        // Run the operation in the next frame so we're sure all listeners have been run
        // This is necessary to know if preventDefault() has been called
        requestAnimationFrame(() => {
          if (
            state.index > 0 &&
            isFocused &&
            !(e as unknown as EventArg<'tabPress', true>).defaultPrevented
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
    <NavigationContent>
      <StackView
        {...rest}
        direction={direction}
        state={state}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

export interface StackTypeBag extends NavigatorTypeBagFactory {
  State: StackNavigationState<this['input']>;
  ScreenOptions: StackNavigationOptions;
  EventMap: StackNavigationEventMap;
  ActionHelpers: StackActionHelpers<this['input']>;
  Navigator: typeof StackNavigator;
}

export const createStackNavigator =
  createNavigatorFactory<StackTypeBag>(StackNavigator);

export const createStackScreen = createStaticScreenFactory<StackTypeBag>();
