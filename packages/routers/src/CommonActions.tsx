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

export function goBack(): Action {
  return { type: 'GO_BACK' };
}

export function navigate(
  name: string,
  params?: object | undefined,
  options?:
    | {
        merge?: boolean | undefined;
        pop?: boolean | undefined;
      }
    | undefined
): Action {
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

export function setParams(params: object) {
  return {
    type: 'SET_PARAMS',
    payload: { params },
  } as const satisfies SetParamsAction;
}

export function replaceParams(params: object) {
  return {
    type: 'REPLACE_PARAMS',
    payload: { params },
  } as const satisfies ReplaceParamsAction;
}

export function pushParams(params: object) {
  return {
    type: 'PUSH_PARAMS',
    payload: { params },
  } as const satisfies PushParamsAction;
}

export function preload(name: string, params?: object | undefined) {
  return {
    type: 'PRELOAD',
    payload: { name, params },
  } as const satisfies PreloadAction;
}
