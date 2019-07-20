import { PartialState, TargetRoute } from './types';

export type Action =
  | { type: 'GO_BACK' }
  | {
      type: 'NAVIGATE';
      payload: { name?: string; key?: string; params?: object };
    }
  | {
      type: 'REPLACE';
      payload: { name: string; params?: object };
    }
  | {
      type: 'RESET';
      payload: PartialState & { key?: string };
    };

export function goBack(): Action {
  return { type: 'GO_BACK' };
}

export function navigate(target: TargetRoute<string>, params?: object): Action {
  if (
    (target.hasOwnProperty('key') && target.hasOwnProperty('name')) ||
    (!target.hasOwnProperty('key') && !target.hasOwnProperty('name'))
  ) {
    throw new Error(
      'While calling navigate you need to specify either name or key'
    );
  }
  if (typeof target === 'string') {
    return { type: 'NAVIGATE', payload: { name: target, params } };
  } else {
    return { type: 'NAVIGATE', payload: { ...target, params } };
  }
}

export function replace(name: string, params?: object): Action {
  return { type: 'REPLACE', payload: { name, params } };
}

export function reset(state: PartialState & { key?: string }): Action {
  return { type: 'RESET', payload: state };
}
