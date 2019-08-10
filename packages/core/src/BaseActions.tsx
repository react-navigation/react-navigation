import { NavigationState } from './types';

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
      payload: Partial<NavigationState>;
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

export function navigate(
  route: { key: string; params?: object } | { name: string; params?: object }
): Action;
export function navigate(name: string, params?: object): Action;
export function navigate(...args: any): Action {
  if (typeof args[0] === 'string') {
    return { type: 'NAVIGATE', payload: { name: args[0], params: args[1] } };
  } else {
    const payload = args[0];

    if (
      (payload.hasOwnProperty('key') && payload.hasOwnProperty('name')) ||
      (!payload.hasOwnProperty('key') && !payload.hasOwnProperty('name'))
    ) {
      throw new Error(
        'While calling navigate with an object as the argument, you need to specify either name or key'
      );
    }

    return { type: 'NAVIGATE', payload };
  }
}

export function replace(name: string, params?: object): Action {
  return { type: 'REPLACE', payload: { name, params } };
}

export function reset(state: Partial<NavigationState>): Action {
  return { type: 'RESET', payload: state };
}

export function setParams(params: object): Action {
  return { type: 'SET_PARAMS', payload: { params } };
}
