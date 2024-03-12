import {
  createNavigatorFactory,
  type DefaultNavigatorOptions,
  type EventArg,
  type NavigationListBase,
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
  StackNavigationConfig,
  StackNavigationEventMap,
  StackNavigationOptions,
  StackNavigationProp,
} from '../types';
import { StackView } from '../views/Stack/StackView';

type Props = DefaultNavigatorOptions<
  ParamListBase,
  string | undefined,
  StackNavigationState<ParamListBase>,
  StackNavigationOptions,
  StackNavigationEventMap,
  StackNavigationProp<ParamListBase>
> &
  StackRouterOptions &
  StackNavigationConfig;

function StackNavigator({
  id,
  initialRouteName,
  getStateForRouteNamesChange,
  children,
  layout,
  screenListeners,
  screenOptions,
  screenLayout,
  ...rest
}: Props) {
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
      children,
      layout,
      screenListeners,
      screenOptions,
      screenLayout,
      getStateForRouteNamesChange,
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
        describe={describe}
        descriptors={descriptors}
        navigation={navigation}
      />
    </NavigationContent>
  );
}

export function createStackNavigator<
  ParamList extends ParamListBase,
  NavigatorID extends string | undefined = undefined,
  NavigationList extends NavigationListBase<ParamList> = {
    [RouteName in keyof ParamList]: StackNavigationProp<
      ParamList,
      RouteName,
      NavigatorID
    >;
  },
  Config extends StaticConfig<
    ParamList,
    NavigatorID,
    StackNavigationState<ParamList>,
    StackNavigationOptions,
    StackNavigationEventMap,
    NavigationList,
    typeof StackNavigator
  > = StaticConfig<
    ParamList,
    NavigatorID,
    StackNavigationState<ParamList>,
    StackNavigationOptions,
    StackNavigationEventMap,
    NavigationList,
    typeof StackNavigator
  >,
>(
  config?: Config
): TypedNavigator<
  ParamList,
  NavigatorID,
  StackNavigationState<ParamList>,
  StackNavigationOptions,
  StackNavigationEventMap,
  NavigationList,
  typeof StackNavigator
> &
  (typeof config extends undefined ? {} : { config: Config }) {
  return createNavigatorFactory(StackNavigator)(config);
}
