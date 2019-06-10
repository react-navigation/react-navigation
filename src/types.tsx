import * as BaseActions from './BaseActions';

export type CommonAction = BaseActions.Action;

export type NavigationState = {
  key: string;
  index: number;
  names: string[];
  routes: Array<Route & { state?: NavigationState }>;
};

export type InitialState = Omit<Omit<NavigationState, 'names'>, 'key'> & {
  key?: undefined;
  names?: undefined;
  state?: InitialState;
};

export type Route = {
  key: string;
  name: string;
  params?: object;
};

export type NavigationAction = {
  type: string;
};

export type Router<Action extends NavigationAction = NavigationAction> = {
  normalize(options: {
    screens: { [key: string]: ScreenProps };
    currentState?: NavigationState | InitialState;
    initialRouteName?: string;
  }): NavigationState;
  reduce(
    state: NavigationState,
    action: Action | CommonAction
  ): NavigationState | null;
  actions: { [key: string]: (...args: any) => Action };
};

export type ParamListBase = { [key: string]: object | void };

class PrivateValueStore<T> {
  // TypeScript requires a type to be actually used to be able to infer it.
  // This is a hacky way of storing type in a property without surfacing it in intellisense.
  // @ts-ignore
  private __private_value_type?: T;
}

export type NavigationHelpers<ParamList extends ParamListBase = {}> = {
  dispatch(action: NavigationAction): void;
  navigate<RouteName extends keyof ParamList>(
    ...args: ParamList[RouteName] extends void
      ? [RouteName]
      : [RouteName, ParamList[RouteName]]
  ): void;
  reset(state: InitialState & { key?: string }): void;
  goBack(): void;
} & PrivateValueStore<ParamList>;

export type NavigationProp<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList
> = NavigationHelpers<ParamList> & {
  state: Route & { name: RouteName } & (ParamList[RouteName] extends void
      ? never
      : { params: ParamList[RouteName] });
};

export type CompositeNavigationProp<
  A extends NavigationProp<ParamListBase, string>,
  B extends NavigationProp<ParamListBase, string>
> = Omit<A & B, keyof NavigationHelpers<any>> &
  NavigationHelpers<
    (A extends NavigationHelpers<infer T> ? T : never) &
      (B extends NavigationHelpers<infer U> ? U : never)
  >;

export type Descriptor = {
  render(): React.ReactNode;
  options: Options;
};

export type Options = {
  title?: string;
  [key: string]: any;
};

export type ScreenProps = {
  name: string;
  options?: Options;
  initialParams?: object;
} & (
  | { component: React.ComponentType<any> }
  | { children: (props: any) => React.ReactNode });
