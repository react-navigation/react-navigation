import {
  createNavigatorFactory,
  DefaultNavigatorOptions,
  EventArg,
  ParamListBase,
  StackActionHelpers,
  StackActions,
  StackNavigationState,
  StackRouter,
  StackRouterOptions,
  useLocale,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  StackNavigationConfig,
  StackNavigationEventMap,
  StackNavigationOptions,
} from '../types';
import { StackView } from '../views/Stack/StackView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap
> &
  StackRouterOptions &
  StackNavigationConfig;

function StackNavigator({
  id,
  initialRouteName,
  children,
  layout,
  screenListeners,
  screenOptions,
  ...rest
}: Props) {
  const { direction } = useLocale();
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      StackNavigationOptions,
      StackNavigationEventMap
    >(StackRouter, {
      id,
      initialRouteName,
      children,
      layout,
      screenListeners,
      screenOptions,
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

export const createStackNavigator = createNavigatorFactory<
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  typeof StackNavigator
>(StackNavigator);
