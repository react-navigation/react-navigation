export type NavigationRoute = {
  key: string;
  name: string;
  params?: object;
  state?: NavigationState;
};

export type NavigationState = {
  key: string;
  index: number;
  routes: NavigationRoute[];
};

export type NavigationAction = {
  type: string;
  payload?: object;
};

export type PartialRoute = {
  name: string;
  params?: object;
  state?: PartialState;
};

export type PartialState = {
  routes: PartialRoute[];
};

export type Log = {
  id: string;
  action: NavigationAction;
  state: NavigationState | undefined;
  stack: string | undefined;
};

export type StoreType = {
  logs: Log[];
  index: number;
  navigation: (method: string, ...args: any[]) => Promise<any>;
  linking: (method: string, ...args: any[]) => Promise<any>;
  resetTo: (id: string) => Promise<void>;
};
