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
  type StaticConfig,
  type TypedNavigator,
  useLocale,
  useNavigationBuilder,
} from '@react-navigation/native';
import * as React from 'react';

import type {
  StackNavigationEventMap,
  StackNavigationOptions,
  StackNavigationProp,
  StackNavigatorProps,
} from '../types';
import { StackView } from '../views/Stack/StackView';

function StackNavigator({
  id,
  initialRouteName,
  UNSTABLE_routeNamesChangeBehavior,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  UNSTABLE_router,
  ...rest
}: StackNavigatorProps) {
  const { direction } = useLocale();

  const { state, describe, descriptors, navigation, NavigationContent } =
    useNavigationBuilder<
      StackNavigationState<ParamListBase>,
      StackRouterOptions,
      StackActionHelpers<ParamListBase>,
      StackNavigationOptions,
      StackNavigationEventMap
    >(StackRouter, {
      id,
      initialRouteName,
      UNSTABLE_routeNamesChangeBehavior,
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      UNSTABLE_router,
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

        if (
          isFocused &&
          currentState.index > 0 &&
          !(e as EventArg<'tabPress', true>).defaultPrevented
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

  return (
    <NavigationContent>
      <StackView
        {...rest}
        direction={direction}
        state={state}
        describe={describe}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

export type StackTypeBag<
  ParamList extends ParamListBase = ParamListBase,
  NavigatorID extends string | undefined = string | undefined,
> = {
  ParamList: ParamList;
  NavigatorID: NavigatorID;
  State: StackNavigationState<ParamList>;
  ScreenOptions: StackNavigationOptions;
  EventMap: StackNavigationEventMap;
  NavigationList: {
    [RouteName in keyof ParamList]: StackNavigationProp<
      ParamList,
      RouteName,
      NavigatorID
    >;
  };
  Navigator: typeof StackNavigator;
};

export function createStackNavigator<
  const ParamList extends ParamListBase,
  const NavigatorID extends string | undefined = string | undefined,
  const TypeBag extends NavigatorTypeBagBase = StackTypeBag<
    ParamList,
    NavigatorID
  >,
  const Config extends StaticConfig<TypeBag> = StaticConfig<TypeBag>,
>(config?: Config): TypedNavigator<TypeBag, Config> {
  return createNavigatorFactory(StackNavigator)(config);
}

export const createStackScreen = createScreenFactory<StackTypeBag>();
