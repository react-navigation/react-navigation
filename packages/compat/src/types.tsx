import type {
  ParamListBase,
  NavigationProp,
  Route,
} from '@react-navigation/native';
import type * as helpers from './helpers';

export type CompatNavigationProp<
  NavigationPropType extends NavigationProp<ParamListBase>,
  ParamList extends ParamListBase = NavigationPropType extends NavigationProp<
    infer P,
    any,
    any,
    any,
    any
  >
    ? P
    : ParamListBase,
  RouteName extends Extract<keyof ParamList, string> = Extract<
    NavigationPropType extends NavigationProp<any, infer R> ? R : string,
    string
  >
> = Omit<NavigationPropType, keyof typeof helpers> &
  {
    [method in Extract<keyof NavigationPropType, keyof typeof helpers>]: (
      ...args: Parameters<typeof helpers[method]>
    ) => void;
  } & {
    state: Route<RouteName> & {
      routeName: RouteName;
    };
    getParam<T extends keyof ParamList[RouteName]>(
      paramName: T,
      defaultValue?: ParamList[RouteName][T]
    ): ParamList[RouteName][T];
    isFirstRouteInParent(): boolean;
    dangerouslyGetParent<
      T = NavigationProp<ParamListBase> | undefined
    >(): T extends NavigationProp<ParamListBase>
      ? CompatNavigationProp<T>
      : undefined;
  };

export type CompatNavigationOptions<
  NavigationPropType extends NavigationProp<ParamListBase>,
  ScreenOptions extends {} = NavigationPropType extends NavigationProp<
    any,
    any,
    any,
    infer O
  >
    ? O
    : {}
> =
  | ((options: {
      navigation: CompatNavigationProp<NavigationPropType>;
      navigationOptions: Partial<ScreenOptions>;
      screenProps: unknown;
    }) => ScreenOptions)
  | ScreenOptions;

export type CompatScreenType<
  NavigationPropType extends NavigationProp<ParamListBase>
> = React.ComponentType<{
  navigation: CompatNavigationProp<NavigationPropType>;
  screenProps: unknown;
}> & {
  navigationOptions?: CompatNavigationOptions<NavigationPropType>;
};

export type CompatRouteConfig<
  NavigationPropType extends NavigationProp<ParamListBase>,
  ParamList extends ParamListBase = NavigationPropType extends NavigationProp<
    infer P,
    any,
    any,
    any,
    any
  >
    ? P
    : ParamListBase
> = {
  [RouteName in keyof ParamList]:
    | React.ComponentType<any>
    | ((
        | { screen: React.ComponentType<any> }
        | { getScreen(): React.ComponentType<any> }
      ) & {
        navigationOptions?: CompatNavigationOptions<NavigationPropType>;
        params?: ParamList[RouteName];
      });
};
