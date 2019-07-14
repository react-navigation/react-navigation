import { PartialState } from './types';

export type Action =
  | { type: 'GO_BACK' }
  | {
      type: 'NAVIGATE';
      payload: { name: string; params?: object };
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

export function navigate(name: string, params?: object): Action {
  return { type: 'NAVIGATE', payload: { name, params } };
}

export function replace(name: string, params?: object): Action {
  return { type: 'REPLACE', payload: { name, params } };
}

export function reset(state: PartialState & { key?: string }): Action {
  return { type: 'RESET', payload: state };
}
