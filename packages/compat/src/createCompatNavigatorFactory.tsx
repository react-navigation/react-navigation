import * as React from 'react';
import {
  NavigationState,
  PartialState,
  ParamListBase,
  TypedNavigator,
  NavigationProp,
  RouteProp,
  NavigationRouteContext,
} from '@react-navigation/native';
import CompatScreen from './CompatScreen';
import ScreenPropsContext from './ScreenPropsContext';
import createCompatNavigationProp from './createCompatNavigationProp';
import type { CompatScreenType, CompatRouteConfig } from './types';

export default function createCompatNavigatorFactory<
  CreateNavigator extends () => TypedNavigator<
    ParamListBase,
    NavigationState,
    {},
    any,
    React.ComponentType<any>
  >
>(createNavigator: CreateNavigator) {
  // @ts-expect-error: isCompat may or may not exist
  if (createNavigator.isCompat) {
    throw new Error(
      `The navigator is already in compat mode. You don't need to wrap it in 'createCompatNavigatorFactory'.`
    );
  }

  const createCompatNavigator = <
    NavigationPropType extends NavigationProp<any, any, any, any, any>,
    ParamList extends ParamListBase = NavigationPropType extends NavigationProp<
      infer P,
      any,
      any,
      any,
      any
    >
      ? P
      : ParamListBase,
    ScreenOptions extends {} = NavigationPropType extends NavigationProp<
      any,
      any,
      any,
      infer O
    >
      ? O
      : {},
    NavigationConfig extends {} = React.ComponentProps<
      ReturnType<CreateNavigator>['Navigator']
    >
  >(
    routeConfig: CompatRouteConfig<NavigationPropType>,
    navigationConfig: Partial<Omit<NavigationConfig, 'screenOptions'>> & {
      order?: Extract<keyof ParamList, string>[];
      defaultNavigationOptions?: ScreenOptions;
      navigationOptions?: Record<string, any>;
    } = {}
  ) => {
    const Pair = createNavigator();

    const {
      order,
      defaultNavigationOptions,
      navigationOptions: parentNavigationOptions,
      ...restConfig
    } = navigationConfig;

    const routeNames = order !== undefined ? order : Object.keys(routeConfig);

    function Navigator({ screenProps }: { screenProps?: unknown }) {
      const parentRouteParams = React.useContext(NavigationRouteContext)
        ?.params;

      const screens = React.useMemo(
        () =>
          routeNames.map((name) => {
            let getScreenComponent: () => CompatScreenType<NavigationPropType>;

            let initialParams;

            const routeConfigItem = routeConfig[name];

            if ('getScreen' in routeConfigItem) {
              getScreenComponent = routeConfigItem.getScreen;
              initialParams = routeConfigItem.params;
            } else if ('screen' in routeConfigItem) {
              getScreenComponent = () => routeConfigItem.screen;
              initialParams = routeConfigItem.params;
            } else {
              getScreenComponent = () => routeConfigItem;
            }

            const screenOptions = ({
              navigation,
              route,
            }: {
              navigation: NavigationPropType;
              route: RouteProp<ParamList, keyof ParamList> & {
                state?: NavigationState | PartialState<NavigationState>;
              };
            }) => {
              // @ts-expect-error: navigationOptions may exists on the component, but TS is dumb
              const routeNavigationOptions = routeConfigItem.navigationOptions;
              const screenNavigationOptions = getScreenComponent()
                .navigationOptions;

              if (
                routeNavigationOptions == null &&
                screenNavigationOptions == null
              ) {
                return undefined;
              }

              const options =
                typeof routeNavigationOptions === 'function' ||
                typeof screenNavigationOptions === 'function'
                  ? {
                      navigation: createCompatNavigationProp<
                        NavigationPropType,
                        ParamList
                      >(navigation, route, {}),
                      navigationOptions: defaultNavigationOptions || {},
                      screenProps,
                    }
                  : {};

              return {
                ...(typeof routeNavigationOptions === 'function'
                  ? routeNavigationOptions(options)
                  : routeNavigationOptions),
                ...(typeof screenNavigationOptions === 'function'
                  ? (screenNavigationOptions as (o: any) => ScreenOptions)(
                      options
                    )
                  : screenNavigationOptions),
              } as ScreenOptions;
            };

            return (
              <Pair.Screen
                key={name}
                name={name}
                initialParams={{ ...parentRouteParams, ...initialParams }}
                options={screenOptions}
              >
                {() => <CompatScreen getComponent={getScreenComponent} />}
              </Pair.Screen>
            );
          }),
        [parentRouteParams, screenProps]
      );

      return (
        <ScreenPropsContext.Provider value={screenProps}>
          <Pair.Navigator
            {...(restConfig as NavigationConfig)}
            screenOptions={defaultNavigationOptions}
          >
            {screens}
          </Pair.Navigator>
        </ScreenPropsContext.Provider>
      );
    }

    Navigator.navigationOptions = parentNavigationOptions;

    return Navigator;
  };

  Object.defineProperties(createCompatNavigator, {
    isCompat: {
      get() {
        return true;
      },
    },
    router: {
      get() {
        throw new Error(
          "It's no longer possible to access the router with the 'router' property."
        );
      },
      set() {
        throw new Error(
          "It's no longer possible to override the router by assigning the 'router' property."
        );
      },
    },
  });

  return createCompatNavigator;
}
