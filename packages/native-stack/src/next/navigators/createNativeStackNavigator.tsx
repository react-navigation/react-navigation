import {
  createNavigatorFactory,
  createScreenFactory,
  type EventArg,
  NavigationMetaContext,
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
} from '../../types';
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
      return;
    }

    // @ts-expect-error: there may not be a tab navigator in parent
    return navigation?.addListener?.(
      'tabPress',
      (e: EventArg<'tabPress', true>) => {
        const isFocused = navigation.isFocused();

        requestAnimationFrame(() => {
          if (state.index > 0 && isFocused && !e.defaultPrevented) {
            navigation.dispatch({
              ...StackActions.popToTop(),
              target: state.key,
            });
          }
        });
      }
    );
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
