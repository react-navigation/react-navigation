Object.defineProperty(exports, '__esModule', { value: true });
var BACK = 'Navigation/BACK';
var INIT = 'Navigation/INIT';
var NAVIGATE = 'Navigation/NAVIGATE';
var POP = 'Navigation/POP';
var POP_TO_TOP = 'Navigation/POP_TO_TOP';
var PUSH = 'Navigation/PUSH';
var RESET = 'Navigation/RESET';
var SET_PARAMS = 'Navigation/SET_PARAMS';
var URI = 'Navigation/URI';
var COMPLETE_TRANSITION = 'Navigation/COMPLETE_TRANSITION';
var createAction = function createAction(type, fn) {
  fn.toString = function() {
    return type;
  };
  return fn;
};
var back = createAction(BACK, function() {
  var payload =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  return { type: BACK, key: payload.key };
});
var init = createAction(INIT, function() {
  var payload =
    arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var action = { type: INIT };
  if (payload.params) {
    action.params = payload.params;
  }
  return action;
});
var navigate = createAction(NAVIGATE, function(payload) {
  var action = { type: NAVIGATE, routeName: payload.routeName };
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
var pop = createAction(POP, function(payload) {
  return {
    type: POP,
    n: payload && payload.n,
    immediate: payload && payload.immediate,
  };
});
var popToTop = createAction(POP_TO_TOP, function(payload) {
  return { type: POP_TO_TOP, immediate: payload && payload.immediate };
});
var push = createAction(PUSH, function(payload) {
  var action = { type: PUSH, routeName: payload.routeName };
  if (payload.params) {
    action.params = payload.params;
  }
  if (payload.action) {
    action.action = payload.action;
  }
  return action;
});
var reset = createAction(RESET, function(payload) {
  return {
    type: RESET,
    index: payload.index,
    key: payload.key,
    actions: payload.actions,
  };
});
var setParams = createAction(SET_PARAMS, function(payload) {
  return { type: SET_PARAMS, key: payload.key, params: payload.params };
});
var uri = createAction(URI, function(payload) {
  return { type: URI, uri: payload.uri };
});
var completeTransition = createAction(COMPLETE_TRANSITION, function(payload) {
  return { type: COMPLETE_TRANSITION };
});
var mapDeprecatedNavigateAction = function mapDeprecatedNavigateAction(action) {
  if (action.type === 'Navigate') {
    var payload = { routeName: action.routeName, params: action.params };
    if (action.action) {
      payload.action = mapDeprecatedNavigateAction(action.action);
    }
    return navigate(payload);
  }
  return action;
};
var mapDeprecatedAction = function mapDeprecatedAction(action) {
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
var mapDeprecatedActionAndWarn = function mapDeprecatedActionAndWarn(action) {
  var newAction = mapDeprecatedAction(action);
  if (newAction !== action) {
    var oldType = action.type;
    var newType = newAction.type;
    console.warn(
      [
        "The action type '" +
          oldType +
          "' has been renamed to '" +
          newType +
          "'.",
        "'" +
          oldType +
          "' will continue to work while in beta but will be removed",
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
exports.default = {
  BACK: BACK,
  INIT: INIT,
  NAVIGATE: NAVIGATE,
  POP: POP,
  POP_TO_TOP: POP_TO_TOP,
  PUSH: PUSH,
  RESET: RESET,
  SET_PARAMS: SET_PARAMS,
  URI: URI,
  COMPLETE_TRANSITION: COMPLETE_TRANSITION,
  back: back,
  init: init,
  navigate: navigate,
  pop: pop,
  popToTop: popToTop,
  push: push,
  reset: reset,
  setParams: setParams,
  uri: uri,
  completeTransition: completeTransition,
  mapDeprecatedActionAndWarn: mapDeprecatedActionAndWarn,
};
