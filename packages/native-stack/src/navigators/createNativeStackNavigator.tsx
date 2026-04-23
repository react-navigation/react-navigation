import {
  createNavigatorFactory,
  createStaticScreenFactory,
  type EventArg,
  NavigationMetaContext,
  type NavigatorTypeBagFactory,
  type ParamListBase,
  type StackActionHelpers,
  StackActions,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  NativeStackNavigationEventMap,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
  NativeStackNavigatorProps,
} from '../types';
import { NativeStackView } from '../views/NativeStackView';

function NativeStackNavigator({
  initialRouteName,
  routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  router,
  ...rest
}: NativeStackNavigatorProps) {
  const { state, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      NativeStackNavigationOptions,
      NativeStackNavigationEventMap
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

  const meta = React.use(NavigationMetaContext);

  React.useEffect(() => {
    if (meta && 'type' in meta && meta.type === 'native-tabs') {
      // If we're inside native tabs, we don't need to handle popToTop
      // It's handled natively by native tabs
      return;
    }

    // @ts-expect-error: there may not be a tab navigator in parent
    return navigation?.addListener?.('tabPress', (e: any) => {
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
    });
  }, [meta, navigation, state.index, state.key]);

  return (
    <NavigationContent>
      <NativeStackView
        {...rest}
        state={state}
        navigation={navigation}
        descriptors={descriptors}
      />
    </NavigationContent>
  );
}

export interface NativeStackTypeBag extends NavigatorTypeBagFactory {
  ParamList: this['input'];
  State: StackNavigationState<this['input']>;
  ScreenOptions: NativeStackNavigationOptions;
  EventMap: NativeStackNavigationEventMap;
  NavigationList: {
    [RouteName in keyof this['input']]: NativeStackNavigationProp<
      this['input'],
      RouteName
    >;
  };
  Navigator: typeof NativeStackNavigator;
}

export const createNativeStackNavigator =
  createNavigatorFactory<NativeStackTypeBag>(NativeStackNavigator);

export const createNativeStackScreen =
  createStaticScreenFactory<NativeStackTypeBag>();
