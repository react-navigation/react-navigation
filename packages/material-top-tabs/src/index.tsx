import * as React from 'react';
import { TabView, TabBar } from 'react-native-tab-view';
import {
  useNavigationBuilder,
  NavigationProp,
  ParamListBase,
  createNavigator,
} from '@navigation-ex/core';
import {
  TabRouter,
  TabRouterOptions,
  TabNavigationState,
} from '@navigation-ex/routers';

type Props = TabRouterOptions &
  Partial<
    Omit<
      React.ComponentProps<typeof TabView>,
      'navigationState' | 'onIndexChange' | 'renderScene' | 'renderTabBar'
    >
  > & {
    children: React.ReactNode;
  };

export type MaterialTopTabNavigationOptions = {
  /**
   * Title text for the screen.
   */
  title?: string;
};

export type MaterialTopTabNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = string
> = NavigationProp<
  ParamList,
  RouteName,
  TabNavigationState,
  MaterialTopTabNavigationOptions
> & {
  /**
   * Jump to an existing tab.
   *
   * @param name Name of the route for the tab.
   * @param [params] Params object for the route.
   */
  jumpTo<RouteName extends Extract<keyof ParamList, string>>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;
};

function TabNavigator({
  initialRouteName,
  backBehavior,
  children,
  ...rest
}: Props) {
  const { state, descriptors, navigation } = useNavigationBuilder<
    TabNavigationState,
    MaterialTopTabNavigationOptions,
    TabRouterOptions
  >(TabRouter, {
    initialRouteName,
    backBehavior,
    children,
  });

  return (
    <TabView
      {...rest}
      navigationState={state}
      onIndexChange={index =>
        navigation.navigate({ key: state.routes[index].key }, {})
      }
      renderScene={({ route }) => descriptors[route.key].render()}
      renderTabBar={props => (
        <TabBar
          getLabelText={({ route }) => descriptors[route.key].options.title}
          {...props}
        />
      )}
    />
  );
}

export default createNavigator<
  MaterialTopTabNavigationOptions,
  typeof TabNavigator
>(TabNavigator);
