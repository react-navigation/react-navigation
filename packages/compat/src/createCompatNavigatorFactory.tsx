import * as React from 'react';
import {
  NavigationState,
  PartialState,
  ParamListBase,
  TypedNavigator,
  NavigationProp,
  RouteProp,
} from '@react-navigation/core';
import CompatScreen from './CompatScreen';
import ScreenPropsContext from './ScreenPropsContext';
import createCompatNavigationProp from './createCompatNavigationProp';
import { CompatScreenType, CompatRouteConfig } from './types';

export default function createCompatNavigatorFactory<
  CreateNavigator extends () => TypedNavigator<
    ParamListBase,
    {},
    React.ComponentType<any>
  >
>(createNavigator: CreateNavigator) {
  return <
    NavigationPropType extends NavigationProp<any, any, any, any, any>,
    ParamList extends ParamListBase = NavigationPropType extends NavigationProp<
      infer P
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
      order?: Array<Extract<keyof ParamList, string>>;
      defaultNavigationOptions?: ScreenOptions;
      navigationOptions?: { [key: string]: any };
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
      const screens = React.useMemo(
        () =>
          routeNames.map(name => {
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
              // @ts-ignore
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
                        NavigationPropType
                      >(navigation, route),
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
                initialParams={initialParams}
                options={screenOptions}
              >
                {({ navigation, route }) => (
                  <CompatScreen
                    navigation={navigation}
                    route={route}
                    component={getScreenComponent()}
                  />
                )}
              </Pair.Screen>
            );
          }),
        [screenProps]
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

    Navigator.navigationOtions = parentNavigationOptions;

    return Navigator;
  };
}
