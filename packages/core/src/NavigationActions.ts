export interface NavigationParams {
  [key: string]: any;
}

export interface NavigationNavigateActionPayload {
  routeName: string;
  params?: NavigationParams;

  // The action to run inside the sub-router
  action?: NavigationNavigateAction;

  key?: string;
}

export interface NavigationNavigateAction
  extends NavigationNavigateActionPayload {
  type: 'Navigation/NAVIGATE';
}

export interface NavigationBackActionPayload {
  key?: string | null;
  immediate?: boolean;
}

export interface NavigationBackAction extends NavigationBackActionPayload {
  type: 'Navigation/BACK';
}

export interface NavigationInitActionPayload {
  params?: NavigationParams;
}

export interface NavigationInitAction extends NavigationInitActionPayload {
  type: 'Navigation/INIT';
}

export interface NavigationSetParamsActionPayload {
  // The key of the route where the params should be set
  key: string;

  // The new params to merge into the existing route params
  params?: NavigationParams;
}

export interface NavigationSetParamsAction
  extends NavigationSetParamsActionPayload {
  type: 'Navigation/SET_PARAMS';
  preserveFocus: true;
}

// Action constants
export const BACK = 'Navigation/BACK';
export const INIT = 'Navigation/INIT';
export const NAVIGATE = 'Navigation/NAVIGATE';
export const SET_PARAMS = 'Navigation/SET_PARAMS';

// Action creators
export const back = (
  payload: NavigationBackActionPayload = {}
): NavigationBackAction => ({
  type: BACK,
  key: payload.key,
  immediate: payload.immediate,
});

export const init = (payload: NavigationInitActionPayload = {}) => {
  const action: NavigationInitAction = {
    type: INIT,
  };
  if (payload.params) {
    action.params = payload.params;
  }
  return action;
};

export const navigate = (
  payload: NavigationNavigateActionPayload
): NavigationNavigateAction => {
  const action: NavigationNavigateAction = {
    type: NAVIGATE,
    routeName: payload.routeName,
  };
  if (payload.params) {
    action.params = payload.params;
  }
  if (payload.action) {
    action.action = payload.action;
  }
  if (payload.key) {
    action.key = payload.key;
  }
  return action;
};

export const setParams = (
  payload: NavigationSetParamsActionPayload
): NavigationSetParamsAction => ({
  type: SET_PARAMS,
  key: payload.key,
  params: payload.params,
  preserveFocus: true,
});
