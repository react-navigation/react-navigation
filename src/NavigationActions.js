const BACK = 'Navigation/BACK';
const INIT = 'Navigation/INIT';
const NAVIGATE = 'Navigation/NAVIGATE';
const POP = 'Navigation/POP';
const POP_TO_TOP = 'Navigation/POP_TO_TOP';
const PUSH = 'Navigation/PUSH';
const RESET = 'Navigation/RESET';
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
}));

const mapDeprecatedNavigateAction = action => {
  if (action.type === 'Navigate') {
    const payload = {
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

const mapDeprecatedAction = action => {
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

const mapDeprecatedActionAndWarn = action => {
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
  POP,
  POP_TO_TOP,
  PUSH,
  RESET,
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
  setParams,
  uri,
  completeTransition,

  // TODO: Remove once old actions are deprecated
  mapDeprecatedActionAndWarn,
};
