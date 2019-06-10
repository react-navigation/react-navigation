import { NavigationState } from './types';

export type Action =
  | { type: 'GO_BACK' }
  | {
      type: 'NAVIGATE';
      payload: { name: string };
    }
  | {
      type: 'RESET';
      payload: NavigationState;
    };

export function goBack(): Action {
  return { type: 'GO_BACK' };
}

export function navigate(name: string): Action {
  return { type: 'NAVIGATE', payload: { name } };
}

export function reset(state: NavigationState): Action {
  return { type: 'RESET', payload: state };
}
