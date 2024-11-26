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
      payload: {
        name: string;
        params?: object;
        path?: string;
        merge?: boolean;
      };
      source?: string;
      target?: string;
    }
  | {
      type: 'NAVIGATE_DEPRECATED';
      payload: {
        name: string;
        params?: object;
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
    }
  | {
      type: 'PRELOAD';
      payload: {
        name: string;
        params?: object;
      };
      source?: string;
      target?: string;
    };

export function goBack(): Action {
  return { type: 'GO_BACK' };
}

export function navigate(
  name: string,
  params?: object,
  merge?: boolean
): Action;

export function navigate(options: {
  name: string;
  params?: object;
  merge?: boolean;
  path?: string;
}): Action;

export function navigate(...args: any): Action {
  if (typeof args[0] === 'string') {
    const [name, params, merge] = args;

    return {
      type: 'NAVIGATE',
      payload: { name, params, merge },
    };
  } else {
    const payload = args[0] || {};

    if (!('name' in payload)) {
      throw new Error(
        'You need to specify a name when calling navigate with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigate for usage.'
      );
    }

    return { type: 'NAVIGATE', payload };
  }
}

export function navigateDeprecated(
  ...args:
    | [name: string]
    | [name: string, params: object | undefined]
    | [options: { name: string; params?: object }]
): Action {
  if (typeof args[0] === 'string') {
    return {
      type: 'NAVIGATE_DEPRECATED',
      payload: { name: args[0], params: args[1] },
    };
  } else {
    const payload = args[0] || {};

    if (!('name' in payload)) {
      throw new Error(
        'You need to specify a name when calling navigate with an object as the argument. See https://reactnavigation.org/docs/navigation-actions#navigatelegacy for usage.'
      );
    }

    return { type: 'NAVIGATE_DEPRECATED', payload };
  }
}

export function reset(state: ResetState | undefined): Action {
  return { type: 'RESET', payload: state };
}

export function setParams(params: object): Action {
  return { type: 'SET_PARAMS', payload: { params } };
}

export function preload(name: string, params?: object): Action {
  return { type: 'PRELOAD', payload: { name, params } };
}
