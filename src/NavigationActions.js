/**
 * @flow
 */

import type {
  NavigationAction,
  PossiblyDeprecatedNavigationAction,
  DeprecatedNavigationNavigateAction,
  NavigationInitAction,
  NavigationNavigateAction,
  NavigationBackAction,
  NavigationSetParamsAction,
  NavigationResetAction,
  NavigationUriAction,
  NavigationParams,
} from './TypeDefinition';

const BACK = 'Navigation/BACK';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const RESET = 'Navigation/RESET';
const SET_PARAMS = 'Navigation/SET_PARAMS';
const URI = 'Navigation/URI';

const createAction = (type: string, fn: any) => {
  fn.toString = () => type;
  return fn;
};

const back = createAction(
  BACK,
  (payload: { key?: ?string } = {}): NavigationBackAction => ({
    type: BACK,
    key: payload.key,
  })
);
const init = createAction(
  INIT,
  (payload: { params?: NavigationParams } = {}): NavigationInitAction => {
    const action: NavigationInitAction = {
      type: INIT,
    };
    if (payload.params) {
      action.params = payload.params;
    }
    return action;
  }
);
const navigate = createAction(
  NAVIGATE,
  (payload: {
    routeName: string,
    params?: ?NavigationParams,
    action?: ?NavigationNavigateAction,
  }): NavigationNavigateAction => {
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
    return action;
  }
);
const reset = createAction(
  RESET,
  (payload: {
    index: number,
    key?: ?string,
    actions: Array<NavigationNavigateAction>,
  }): NavigationResetAction => ({
    type: RESET,
    index: payload.index,
    key: payload.key,
    actions: payload.actions,
  })
);
const setParams = createAction(
  SET_PARAMS,
  (payload: {
    key: string,
    params: NavigationParams,
  }): NavigationSetParamsAction => ({
    type: SET_PARAMS,
    key: payload.key,
    params: payload.params,
  })
);
const uri = createAction(
  URI,
  (payload: { uri: string }): NavigationUriAction => ({
    type: URI,
    uri: payload.uri,
  })
);

const mapDeprecatedNavigateAction = (
  action: NavigationNavigateAction | DeprecatedNavigationNavigateAction
): NavigationNavigateAction => {
  if (action.type === 'Navigate') {
    const payload: Object = {
      routeName: action.routeName,
      params: action.params,
    };
    if (action.action) {
      payload.action = mapDeprecatedNavigateAction(action.action);
    }
    return navigate(payload);
  }
  return action;
};

const mapDeprecatedAction = (
  action: PossiblyDeprecatedNavigationAction
): NavigationAction => {
  if (action.type === 'Back') {
    return back(action);
  } else if (action.type === 'Init') {
    return init(action);
  } else if (action.type === 'Navigate') {
    return mapDeprecatedNavigateAction(action);
  } else if (action.type === 'Reset') {
    return reset({
      index: action.index,
      key: action.key,
      actions: action.actions.map(mapDeprecatedNavigateAction),
    });
  } else if (action.type === 'SetParams') {
    return setParams(action);
  }
  return action;
};

const mapDeprecatedActionAndWarn = (
  action: PossiblyDeprecatedNavigationAction
): NavigationAction => {
  const newAction = mapDeprecatedAction(action);
  if (newAction !== action) {
    const oldType = action.type;
    const newType = newAction.type;
    console.warn(
      [
        `The action type '${oldType}' has been renamed to '${newType}'.`,
        `'${oldType}' will continue to work while in beta but will be removed`,
        'in the first major release. Moving forward, you should use the',
        'action constants and action creators exported by this library in',
        "the 'actions' object.",
        'See https://github.com/react-community/react-navigation/pull/120 for',
        'more details.',
      ].join(' ')
    );
  }
  return newAction;
};

export default {
  // Action constants
  BACK,
  INIT,
  NAVIGATE,
  RESET,
  SET_PARAMS,
  URI,

  // Action creators
  back,
  init,
  navigate,
  reset,
  setParams,
  uri,

  // TODO: Remove once old actions are deprecated
  mapDeprecatedActionAndWarn,
};
