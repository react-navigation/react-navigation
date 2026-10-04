import {
  createNavigatorFactory,
  createScreenFactory,
  type EventArg,
  type NavigatorTypeBagBase,
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
  NativeStackNavigatorProps,
} from '../types';
import { NativeStackView } from '../views/NativeStackView';

type TabPressEventArg = EventArg<
  'tabPress',
  true,
  { origin?: string; behavior?: { popToTop?: boolean } } | undefined
>;

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
  const { state, descriptors, navigation, render } = useNavigationBuilder<
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

  React.useEffect(() => {
    let handle: ReturnType<typeof requestAnimationFrame> | undefined;

    // @ts-expect-error: there may not be a tab navigator in parent
    const unsubscribe = navigation.addListener?.('tabPress', (e) => {
      const isFocused = navigation.isFocused();

      cancelAnimationFrame(handle);

      // Run the operation in the next frame so we're sure all listeners have been run
      // This is necessary to know if preventDefault() has been called
      handle = requestAnimationFrame(() => {
        const currentState = navigation.getState();
        const event = e as TabPressEventArg;

        if (
          isFocused &&
          event.data?.behavior?.popToTop !== false &&
          // Native tabs pop native stacks natively, so we don't need to handle it
          event.data?.origin !== 'native' &&
          (currentState.index > 0 || currentState.routes[0]?.history?.length) &&
          !event.defaultPrevented
        ) {
          // When user taps on already focused tab and we're inside the tab,
          // reset the stack to replicate native behaviour
          navigation.dispatch({
            ...StackActions.popToTop(),
            target: currentState.key,
          });
        }
      });
    });

    return () => {
      cancelAnimationFrame(handle);
      unsubscribe?.();
    };
  }, [navigation]);

  return render(
    <NativeStackView
      {...rest}
      state={state}
      navigation={navigation}
      descriptors={descriptors}
    />
  );
}

export interface NativeStackTypeBag extends NavigatorTypeBagBase {
  State: StackNavigationState<this['ParamList']>;
  ScreenOptions: NativeStackNavigationOptions;
  EventMap: NativeStackNavigationEventMap;
  ActionHelpers: StackActionHelpers<this['ParamList']>;
  Navigator: typeof NativeStackNavigator;
}

export const createNativeStackNavigator =
  createNavigatorFactory<NativeStackTypeBag>(NativeStackNavigator);

export const createNativeStackScreen =
  createScreenFactory<NativeStackTypeBag>();
