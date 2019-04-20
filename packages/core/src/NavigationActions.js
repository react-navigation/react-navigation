// Action constants
export const BACK = 'Navigation/BACK';
export const INIT = 'Navigation/INIT';
export const NAVIGATE = 'Navigation/NAVIGATE';
export const SET_PARAMS = 'Navigation/SET_PARAMS';

// Action creators
export const back = (payload = {}) => ({
  type: BACK,
  key: payload.key,
  immediate: payload.immediate,
});

export const init = (payload = {}) => {
  const action = {
    type: INIT,
  };
  if (payload.params) {
    action.params = payload.params;
  }
  return action;
};

export const navigate = payload => {
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
};

export const setParams = payload => ({
  type: SET_PARAMS,
  key: payload.key,
  params: payload.params,
  preserveFocus: true,
});
