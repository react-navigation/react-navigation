import invariant from './utils/invariant';

function triggerActionEventSubscribers(
  subscribers,
  action,
  oldState,
  newState
) {
  subscribers.forEach(subscriber =>
    subscriber({
      type: 'action',
      action,
      state: newState,
      lastState: oldState,
    })
  );
}

const reduxSubscribers = new Map();

function constructReactNavigationReduxMiddleware(key, navStateSelector) {
  reduxSubscribers.set(key, new Set());
  return store => next => action => {
    const oldState = store.getState();
    const result = next(action);
    const newState = store.getState();
    triggerActionEventSubscribers(
      reduxSubscribers.get(key),
      action,
      navStateSelector(oldState),
      navStateSelector(newState)
    );
  };
}

function constructReduxBoundAddListener(key) {
  invariant(
    reduxSubscribers.has(key),
    "Cannot listen for a key that isn't associated with a Redux store. " +
      'First call `constructReactNavigationReduxMiddleware` so that we know ' +
      'when to trigger your listener.'
  );
  return (eventName, handler) => {
    if (eventName !== 'action') {
      return { remove: () => {} };
    }
    reduxSubscribers.get(key).add(handler);
    return {
      remove: () => {
        reduxSubscribers.get(key).delete(handler);
      },
    };
  };
}

export {
  triggerActionEventSubscribers,
  constructReactNavigationReduxMiddleware,
  constructReduxBoundAddListener,
};
