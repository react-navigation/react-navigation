import type { NavigationState, PartialState, Route } from './types';

type ResetState =
  | PartialState<NavigationState>
  | NavigationState
  | (Omit<NavigationState, 'routes'> & {
      routes: Omit<Route<string>, 'key'>[];
    });

export type Action =
  | {
      type: 'GO_BACK';
      source?: string;
      target?: string;
    }
  | {
      type: 'NAVIGATE';
      payload:
        | {
            key: string;
            name?: undefined;
            params?: object;
            path?: string;
            merge?: boolean;
          }
        | {
            name: string;
            key?: string;
            params?: object;
            path?: string;
            merge?: boolean;
          };
      source?: string;
      target?: string;
    }
  | {
      type: 'RESET';
      payload: ResetState | undefined;
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
  options:
    | { key: string; params?: object; path?: string; merge?: boolean }
    | {
        name: string;
        key?: string;
        params?: object;
        path?: string;
        merge?: boolean;
      }
): Action;
// eslint-disable-next-line no-redeclare
export function navigate(name: string, params?: object): Action;
// eslint-disable-next-line no-redeclare
export function navigate(...args: any): Action {
  if (typeof args[0] === 'string') {
    return { type: 'NAVIGATE', payload: { name: args[0], params: args[1] } };
  } else {
    const payload = args[0] || {};

    if (!payload.hasOwnProperty('key') && !payload.hasOwnProperty('name')) {
      throw new Error(
        'You need to specify name or key when calling navigate with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigate for usage.'
      );
    }

    return { type: 'NAVIGATE', payload };
  }
}

export function reset(state: ResetState | undefined): Action {
  return { type: 'RESET', payload: state };
}

export function setParams(params: object): Action {
  return { type: 'SET_PARAMS', payload: { params } };
}
