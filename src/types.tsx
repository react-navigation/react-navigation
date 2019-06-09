export type NavigationState = {
  index: number;
  routes: Array<Route | Route & NavigationState>;
};

export type Route = {
  name: string;
  key: string;
  params?: {};
};

export type NavigationAction = {
  type: string;
};

export type Router<Action extends NavigationAction = NavigationAction> = {
  getInitialState(
    routeNames: string[],
    options: { initialRouteName?: string }
  ): NavigationState;
  reduce(state: NavigationState, action: Action): NavigationState;
  actions: { [key: string]: (...args: any) => Action };
};

export type NavigationProp<
  T extends { actions: Router['actions'] } = { actions: {} }
> = {
  state: Route | NavigationState;
  dispatch: (action: NavigationAction) => void;
} & {
  [key in keyof T['actions']]: (...args: Parameters<T['actions'][key]>) => void;
};

export type Descriptor<Options = {}> = {
  render(): React.ReactNode;
  options: Options;
};
