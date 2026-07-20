import type {
  NavigationState,
  ParamListBase,
  PartialState,
  Route,
} from './types';

type ResetState =
  | PartialState<NavigationState>
  | NavigationState
  | (Omit<NavigationState, 'routes'> & {
      routes: Omit<Route<string>, 'key'>[];
    });

type GoBackAction = {
  type: 'GO_BACK';
  source?: string | undefined;
  target?: string | undefined;
};

type NavigateAction<ParamList extends ParamListBase = ParamListBase> = {
  [RouteName in keyof ParamList]: {
    type: 'NAVIGATE';
    payload: {
      name: Extract<RouteName, string>;
      path?: string | undefined;
      merge?: boolean | undefined;
      pop?: boolean | undefined;
    } & (undefined extends ParamList[RouteName]
      ? { params?: ParamList[RouteName] }
      : { params: ParamList[RouteName] });
    source?: string | undefined;
    target?: string | undefined;
  };
}[keyof ParamList];

type ResetAction = {
  type: 'RESET';
  payload: ResetState;
  source?: string | undefined;
  target?: string | undefined;
};

type SetParamsAction<ParamList extends ParamListBase = ParamListBase> = {
  [RouteName in keyof ParamList]: {
    type: 'SET_PARAMS';
    payload: {
      params?: Partial<Exclude<ParamList[RouteName], undefined>> | undefined;
    };
    source?: string | undefined;
    target?: string | undefined;
  };
}[keyof ParamList];

type ReplaceParamsAction<ParamList extends ParamListBase = ParamListBase> = {
  [RouteName in keyof ParamList]: {
    type: 'REPLACE_PARAMS';
    payload: undefined extends ParamList[RouteName]
      ? { params?: ParamList[RouteName] }
      : { params: ParamList[RouteName] };
    source?: string | undefined;
    target?: string | undefined;
  };
}[keyof ParamList];

type PushParamsAction<ParamList extends ParamListBase = ParamListBase> = {
  [RouteName in keyof ParamList]: {
    type: 'PUSH_PARAMS';
    payload: undefined extends ParamList[RouteName]
      ? { params?: ParamList[RouteName] }
      : { params: ParamList[RouteName] };
    source?: string | undefined;
    target?: string | undefined;
  };
}[keyof ParamList];

type PreloadAction<ParamList extends ParamListBase = ParamListBase> = {
  [RouteName in keyof ParamList]: {
    type: 'PRELOAD';
    payload: {
      name: Extract<RouteName, string>;
    } & (undefined extends ParamList[RouteName]
      ? { params?: ParamList[RouteName] }
      : { params: ParamList[RouteName] });
    source?: string | undefined;
    target?: string | undefined;
  };
}[keyof ParamList];

export type Action<ParamList extends ParamListBase = ParamListBase> =
  | GoBackAction
  | NavigateAction<ParamList>
  | ResetAction
  | SetParamsAction<ParamList>
  | ReplaceParamsAction<ParamList>
  | PushParamsAction<ParamList>
  | PreloadAction<ParamList>;

export function goBack() {
  return { type: 'GO_BACK' } as const satisfies Action;
}

export function navigate<Name extends string>(
  name: Name
): {
  type: 'NAVIGATE';
  payload: { name: Name; params: undefined; merge: undefined; pop: undefined };
};

export function navigate<
  Name extends string,
  Params extends object | undefined,
>(
  name: Name,
  params: Params,
  options?:
    | {
        merge?: boolean | undefined;
        pop?: boolean | undefined;
      }
    | undefined
): {
  type: 'NAVIGATE';
  payload: {
    name: Name;
    params: Params;
    merge: boolean | undefined;
    pop: boolean | undefined;
  };
};

export function navigate(
  name: string,
  params?: object | undefined,
  options?:
    | {
        merge?: boolean | undefined;
        pop?: boolean | undefined;
      }
    | undefined
) {
  return {
    type: 'NAVIGATE',
    payload: {
      name,
      params,
      merge: options?.merge,
      pop: options?.pop,
    },
  };
}

export function reset(state: ResetState) {
  return { type: 'RESET', payload: state } as const satisfies ResetAction;
}

export function setParams<Params extends object>(params: Params) {
  return {
    type: 'SET_PARAMS',
    payload: { params },
  } as const satisfies SetParamsAction;
}

export function replaceParams<Params extends object>(params: Params) {
  return {
    type: 'REPLACE_PARAMS',
    payload: { params },
  } as const satisfies ReplaceParamsAction;
}

export function pushParams<Params extends object>(params: Params) {
  return {
    type: 'PUSH_PARAMS',
    payload: { params },
  } as const satisfies PushParamsAction;
}

export function preload<Name extends string>(
  name: Name
): {
  type: 'PRELOAD';
  payload: { name: Name; params: undefined };
};

export function preload<Name extends string, Params extends object | undefined>(
  name: Name,
  params: Params
): {
  type: 'PRELOAD';
  payload: { name: Name; params: Params };
};

export function preload(name: string, params?: object | undefined) {
  return {
    type: 'PRELOAD',
    payload: { name, params },
  };
}
