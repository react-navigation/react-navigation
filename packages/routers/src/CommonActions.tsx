import type {
  ActionPayloadParams,
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

type ResetAction = {
  type: 'RESET';
  payload: ResetState;
  source?: string | undefined;
  target?: string | undefined;
};

// All the per-route actions built in a single pass over `keyof ParamList`,
// instead of a separate mapped type per action. The resulting union is the
// same, but the param list is only iterated once per instantiation.
type RouteActions<ParamList extends ParamListBase = ParamListBase> = {
  [RouteName in keyof ParamList]:
    | {
        type: 'NAVIGATE';
        payload: {
          name: Extract<RouteName, string>;
          path?: string | undefined;
          merge?: boolean | undefined;
          pop?: boolean | undefined;
        } & ActionPayloadParams<ParamList[RouteName]>;
        source?: string | undefined;
        target?: string | undefined;
      }
    | {
        type: 'SET_PARAMS';
        payload: {
          params?:
            | Partial<Exclude<ParamList[RouteName], undefined>>
            | undefined;
        };
        source?: string | undefined;
        target?: string | undefined;
      }
    | {
        type: 'REPLACE_PARAMS';
        payload: ActionPayloadParams<ParamList[RouteName]>;
        source?: string | undefined;
        target?: string | undefined;
      }
    | {
        type: 'PUSH_PARAMS';
        payload: ActionPayloadParams<ParamList[RouteName]>;
        source?: string | undefined;
        target?: string | undefined;
      }
    | {
        type: 'PRELOAD';
        payload: {
          name: Extract<RouteName, string>;
        } & ActionPayloadParams<ParamList[RouteName]>;
        source?: string | undefined;
        target?: string | undefined;
      };
}[keyof ParamList];

export type Action<ParamList extends ParamListBase = ParamListBase> =
  | GoBackAction
  | ResetAction
  | RouteActions<ParamList>;

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
  } as const satisfies Action;
}

export function reset(state: ResetState) {
  return { type: 'RESET', payload: state } as const satisfies ResetAction;
}

export function setParams<Params extends object>(params: Params) {
  return {
    type: 'SET_PARAMS',
    payload: { params },
  } as const satisfies Action;
}

export function replaceParams<Params extends object>(params: Params) {
  return {
    type: 'REPLACE_PARAMS',
    payload: { params },
  } as const satisfies Action;
}

export function pushParams<Params extends object>(params: Params) {
  return {
    type: 'PUSH_PARAMS',
    payload: { params },
  } as const satisfies Action;
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
  } as const satisfies Action;
}
