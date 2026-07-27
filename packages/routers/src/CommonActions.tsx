import type { NavigationState, ResetState } from './types';

type GoBackAction = {
  type: 'GO_BACK';
  source?: string | undefined;
  target?: string | undefined;
};

type NavigateAction = {
  type: 'NAVIGATE';
  payload: {
    name: string;
    params?: object | undefined;
    path?: string | undefined;
    merge?: boolean | undefined;
    pop?: boolean | undefined;
  };
  source?: string | undefined;
  target?: string | undefined;
};

type ResetAction = {
  type: 'RESET';
  payload: ResetState<NavigationState>;
  source?: string | undefined;
  target?: string | undefined;
};

type SetParamsAction = {
  type: 'SET_PARAMS';
  payload: { params?: object | undefined };
  source?: string | undefined;
  target?: string | undefined;
};

type ReplaceParamsAction = {
  type: 'REPLACE_PARAMS';
  payload: { params?: object | undefined };
  source?: string | undefined;
  target?: string | undefined;
};

type PushParamsAction = {
  type: 'PUSH_PARAMS';
  payload: { params?: object | undefined };
  source?: string | undefined;
  target?: string | undefined;
};

type PreloadAction = {
  type: 'PRELOAD';
  payload: {
    name: string;
    params?: object | undefined;
  };
  source?: string | undefined;
  target?: string | undefined;
};

export type Action =
  | GoBackAction
  | NavigateAction
  | ResetAction
  | SetParamsAction
  | ReplaceParamsAction
  | PushParamsAction
  | PreloadAction;

export function goBack(): GoBackAction {
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
) {
  return {
    type: 'NAVIGATE',
    payload: {
      name,
      params,
      merge: options?.merge,
      pop: options?.pop,
    },
  } as const satisfies NavigateAction;
}

export function reset(state: ResetState<NavigationState>) {
  return {
    type: 'RESET',
    payload: state,
  } as const satisfies ResetAction;
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
