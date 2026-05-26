import {
  createStandardNavigationFactories,
  type NavigationProp,
  type ParamListBase,
  type RouteProp,
  type StackActionHelpers,
  type StackNavigationState,
  StackRouter,
  type StackRouterOptions,
  type StandardNavigationTypeBagBase,
} from '@react-navigation/native';

import {
  type MyStackEventMap,
  MyStackNavigator,
  type MyStackNavigatorProps,
  type MyStackOptions,
} from './MyStackNavigator';

export type MyStackNavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = NavigationProp<
  ParamList,
  RouteName,
  StackNavigationState<ParamList>,
  MyStackOptions,
  MyStackEventMap,
  StackActionHelpers<ParamList>
>;

export type MyStackScreenProps<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList = keyof ParamList,
> = {
  navigation: MyStackNavigationProp<ParamList, RouteName>;
  route: RouteProp<ParamList, RouteName>;
};

export interface MyStackTypeBag extends StandardNavigationTypeBagBase {
  State: StackNavigationState<this['ParamList']>;
  ActionHelpers: StackActionHelpers<this['ParamList']>;
  ScreenOptions: MyStackOptions;
  EventMap: MyStackEventMap;
  RouterOptions: StackRouterOptions;
}

export const {
  createNavigator: createMyStackNavigator,
  createScreen: createMyStackScreen,
} = createStandardNavigationFactories<MyStackTypeBag, MyStackNavigatorProps>(
  MyStackNavigator,
  StackRouter,
  ({ state }) => ({
    preloadedCount: state.routes.slice(state.index + 1).length,
  })
);
