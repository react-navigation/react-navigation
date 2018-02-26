const BACK = 'Navigation/BACK';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const POP = 'Navigation/POP';
const POP_TO_TOP = 'Navigation/POP_TO_TOP';
const PUSH = 'Navigation/PUSH';
const RESET = 'Navigation/RESET';
const REPLACE = 'Navigation/REPLACE';
const SET_PARAMS = 'Navigation/SET_PARAMS';
const URI = 'Navigation/URI';
const COMPLETE_TRANSITION = 'Navigation/COMPLETE_TRANSITION';

const createAction = (type, fn) => {
  fn.toString = () => type;
  return fn;
};

const back = createAction(BACK, (payload = {}) => ({
  type: BACK,
  key: payload.key,
  immediate: payload.immediate,
}));

const init = createAction(INIT, (payload = {}) => {
  const action = {
    type: INIT,
  };
  if (payload.params) {
    action.params = payload.params;
  }
  return action;
});

const navigate = createAction(NAVIGATE, payload => {
  const action = {
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
});

const pop = createAction(POP, payload => ({
  type: POP,
  n: payload && payload.n,
  immediate: payload && payload.immediate,
}));

const popToTop = createAction(POP_TO_TOP, payload => ({
  type: POP_TO_TOP,
  immediate: payload && payload.immediate,
  key: payload && payload.key,
}));

const push = createAction(PUSH, payload => {
  const action = {
    type: PUSH,
    routeName: payload.routeName,
  };
  if (payload.params) {
    action.params = payload.params;
  }
  if (payload.action) {
    action.action = payload.action;
  }
  return action;
});

const reset = createAction(RESET, payload => ({
  type: RESET,
  index: payload.index,
  key: payload.key,
  actions: payload.actions,
}));

const replace = createAction(REPLACE, payload => ({
  type: REPLACE,
  key: payload.key,
  newKey: payload.newKey,
  params: payload.params,
  action: payload.action,
  routeName: payload.routeName,
  immediate: payload.immediate,
}));

const setParams = createAction(SET_PARAMS, payload => ({
  type: SET_PARAMS,
  key: payload.key,
  params: payload.params,
}));

const uri = createAction(URI, payload => ({
  type: URI,
  uri: payload.uri,
}));

const completeTransition = createAction(COMPLETE_TRANSITION, payload => ({
  type: COMPLETE_TRANSITION,
  key: payload && payload.key,
}));

export default {
  // Action constants
  BACK,
  INIT,
  NAVIGATE,
  POP,
  POP_TO_TOP,
  PUSH,
  RESET,
  REPLACE,
  SET_PARAMS,
  URI,
  COMPLETE_TRANSITION,

  // Action creators
  back,
  init,
  navigate,
  pop,
  popToTop,
  push,
  reset,
  replace,
  setParams,
  uri,
  completeTransition,
};
