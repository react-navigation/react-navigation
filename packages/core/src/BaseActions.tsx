import { PartialState, NavigationState, TargetRoute } from './types';

export type Action =
  | {
      type: 'GO_BACK';
      source?: string;
      target?: string;
    }
  | {
      type: 'NAVIGATE';
      payload:
        | { name: string; key?: undefined; params?: object }
        | { key: string; name?: undefined; params?: object };
      source?: string;
      target?: string;
    }
  | {
      type: 'REPLACE';
      payload: { name: string; params?: object };
      source?: string;
      target?: string;
    }
  | {
      type: 'RESET';
      payload: PartialState<NavigationState> & { key?: string };
      source?: string;
      target?: string;
    }
  | {
      type: 'SET_PARAMS';
      payload: { params?: object };
      source?: string;
      target?: string;
    };

export function goBack(): Action {
  return { type: 'GO_BACK' };
}

export function navigate(target: TargetRoute<string>, params?: object): Action {
  if (typeof target === 'string') {
    return { type: 'NAVIGATE', payload: { name: target, params } };
  } else {
    if (
      (target.hasOwnProperty('key') && target.hasOwnProperty('name')) ||
      (!target.hasOwnProperty('key') && !target.hasOwnProperty('name'))
    ) {
      throw new Error(
        'While calling navigate you need to specify either name or key'
      );
    }
    return { type: 'NAVIGATE', payload: { ...target, params } };
  }
}

export function replace(name: string, params?: object): Action {
  return { type: 'REPLACE', payload: { name, params } };
}

export function reset(
  state: PartialState<NavigationState> & { key?: string }
): Action {
  return { type: 'RESET', payload: state };
}

export function setParams(params: object): Action {
  return { type: 'SET_PARAMS', payload: { params } };
}
