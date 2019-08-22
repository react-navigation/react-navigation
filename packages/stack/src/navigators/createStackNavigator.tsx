import * as React from 'react';
import {
  useNavigationBuilder,
  createNavigator,
  DefaultNavigatorOptions,
  EventArg,
} from '@react-navigation/core';
import {
  StackRouter,
  StackRouterOptions,
  StackNavigationState,
  StackActions,
} from '@react-navigation/routers';
import KeyboardManager from '../views/KeyboardManager';
import StackView from '../views/Stack/StackView';
import {
  StackNavigationConfig,
  StackNavigationOptions,
  StackNavigationEventMap,
} from '../types';

type Props = DefaultNavigatorOptions<StackNavigationOptions> &
  StackRouterOptions &
  StackNavigationConfig;

function StackNavigator({
  keyboardHandlingEnabled,
  initialRouteName,
  children,
  screenOptions,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    StackNavigationState,
    StackNavigationOptions,
    StackRouterOptions,
    StackNavigationEventMap
  >(StackRouter, {
    initialRouteName,
    children,
    screenOptions,
  });

  React.useEffect(
    () =>
      navigation.addListener &&
      navigation.addListener('refocus', (e: EventArg<'refocus', undefined>) => {
        if (state.index > 0 && !e.defaultPrevented) {
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: state.key,
          });
        }
      }),
    [navigation, state.index, state.key]
  );

  return (
    <KeyboardManager enabled={keyboardHandlingEnabled !== false}>
      {props => (
        <StackView
          state={state}
          descriptors={descriptors}
          navigation={navigation}
          {...rest}
          {...props}
        />
      )}
    </KeyboardManager>
  );
}

export default createNavigator<StackNavigationOptions, typeof StackNavigator>(
  StackNavigator
);
