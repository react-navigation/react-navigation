import { InitialState } from './types';

export type Action =
  | { type: 'GO_BACK' }
  | {
      type: 'NAVIGATE';
      payload: { name: string };
    }
  | {
      type: 'RESET';
      payload: InitialState & { key?: string };
    };

export function goBack(): Action {
  return { type: 'GO_BACK' };
}

export function navigate(name: string): Action {
  return { type: 'NAVIGATE', payload: { name } };
}

export function reset(state: InitialState & { key?: string }): Action {
  return { type: 'RESET', payload: state };
}
