/**
 * @flow
 */

import type { NavigationAction } from './TypeDefinition';

const BACK = 'Navigation/BACK';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const RESET = 'Navigation/RESET';
const SET_PARAMS = 'Navigation/SET_PARAMS';
const SET_TRANSITION_END = 'Navigation/SET_TRANSITION_END';
const SET_TRANSITION_START = 'Navigation/SET_TRANSITION_START';
const URI = 'Navigation/URI';

const createAction = (type: string) => (payload: Object = {}) => ({
  type,
  ...payload,
});

const back = createAction(BACK);
const init = createAction(INIT);
const navigate = createAction(NAVIGATE);
const reset = createAction(RESET);
const setParams = createAction(SET_PARAMS);
const setTransitionStart = createAction(SET_TRANSITION_START);
const setTransitionEnd = createAction(SET_TRANSITION_END);
const uri = createAction(URI);

const deprecatedActionMap = {
  Back: BACK,
  Init: INIT,
  Navigate: NAVIGATE,
  Reset: RESET,
  SetParams: SET_PARAMS,
  SetTransitionStart: SET_TRANSITION_START,
  SetTransitionEnd: SET_TRANSITION_END,
  Uri: URI,
};

const mapDeprecatedActionAndWarn = (action: Object) => {
  const mappedType = deprecatedActionMap[action.type];
  if (!mappedType) {
    return action;
  }

  console.warn(
    [
      `The action type '${action.type}' has been renamed to '${mappedType}'.`,
      `'${action.type}' will continue to work while in beta but will be removed`,
      'in the first major release. Moving forward, you should use the',
      'action constants and action creators exported by this library in',
      "the 'actions' object.",
      'See https://github.com/react-community/react-navigation/pull/120 for',
      'more details.',
    ].join(' ')
  );

  return {
    ...action,
    type: deprecatedActionMap[action.type],
  };
};

export default {
  // Action constants
  BACK,
  INIT,
  NAVIGATE,
  RESET,
  SET_PARAMS,
  SET_TRANSITION_START,
  SET_TRANSITION_END,
  URI,

  // Action creators
  back,
  init,
  navigate,
  reset,
  setParams,
  setTransitionStart,
  setTransitionEnd,
  uri,

  // TODO: Remove once old actions are deprecated
  mapDeprecatedActionAndWarn,
};
