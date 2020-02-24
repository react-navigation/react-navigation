import invariant from './utils/invariant';

/**
 * Utilities to perform atomic operation with navigate state and routes.
 *
 * ```javascript
 * const state1 = {key: 'screen 1'};
 * const state2 = NavigationStateUtils.push(state1, {key: 'screen 2'});
 * ```
 */
const StateUtils = {
  /**
   * Gets a route by key. If the route isn't found, returns `null`.
   */
  get(state, key) {
    return state.routes.find(route => route.key === key) || null;
  },

  /**
   * Returns the first index at which a given route's key can be found in the
   * routes of the navigation state, or -1 if it is not present.
   */
  indexOf(state, key) {
    return state.routes.findIndex(route => route.key === key);
  },

  /**
   * Returns `true` at which a given route's key can be found in the
   * routes of the navigation state.
   */
  has(state, key) {
    return !!state.routes.some(route => route.key === key);
  },

  /**
   * Pushes a new route into the navigation state.
   * Note that this moves the index to the position to where the last route in the
   * stack is at.
   */
  push(state, route) {
    invariant(
      StateUtils.indexOf(state, route.key) === -1,
      'should not push route with duplicated key %s',
      route.key
    );

    const routes = state.routes.slice();
    routes.push(route);

    return {
      ...state,
      index: routes.length - 1,
      routes,
    };
  },

  /**
   * Pops out a route from the navigation state.
   * Note that this moves the index to the position to where the last route in the
   * stack is at.
   */
  pop(state) {
    if (state.index <= 0) {
      // [Note]: Over-popping does not throw error. Instead, it will be no-op.
      return state;
    }
    const routes = state.routes.slice(0, -1);
    return {
      ...state,
      index: routes.length - 1,
      routes,
    };
  },

  /**
   * Sets the focused route of the navigation state by index.
   */
  jumpToIndex(state, index) {
    if (index === state.index) {
      return state;
    }

    invariant(!!state.routes[index], 'invalid index %s to jump to', index);

    return {
      ...state,
      index,
    };
  },

  /**
   * Sets the focused route of the navigation state by key.
   */
  jumpTo(state, key) {
    const index = StateUtils.indexOf(state, key);
    return StateUtils.jumpToIndex(state, index);
  },

  /**
   * Sets the focused route to the previous route.
   */
  back(state) {
    const index = state.index - 1;
    const route = state.routes[index];
    return route ? StateUtils.jumpToIndex(state, index) : state;
  },

  /**
   * Sets the focused route to the next route.
   */
  forward(state) {
    const index = state.index + 1;
    const route = state.routes[index];
    return route ? StateUtils.jumpToIndex(state, index) : state;
  },

  /**
   * Replace a route by a key.
   * Note that this moves the index to the position to where the new route in the
   * stack is at and updates the routes array accordingly.
   */
  replaceAndPrune(state, key, route) {
    const index = StateUtils.indexOf(state, key);
    const replaced = StateUtils.replaceAtIndex(state, index, route);

    return {
      ...replaced,
      routes: replaced.routes.slice(0, index + 1),
    };
  },

  /**
   * Replace a route by a key.
   * Note that this moves the index to the position to where the new route in the
   * stack is at. Does not prune the routes.
   * If preserveIndex is true then replacing the route does not cause the index
   * to change to the index of that route.
   */
  replaceAt(state, key, route, preserveIndex = false) {
    const index = StateUtils.indexOf(state, key);
    const nextIndex = preserveIndex ? state.index : index;
    let nextState = StateUtils.replaceAtIndex(state, index, route);
    nextState.index = nextIndex;
    return nextState;
  },

  /**
   * Replace a route by a index.
   * Note that this moves the index to the position to where the new route in the
   * stack is at.
   */
  replaceAtIndex(state, index, route) {
    invariant(
      !!state.routes[index],
      'invalid index %s for replacing route %s',
      index,
      route.key
    );

    if (state.routes[index] === route && index === state.index) {
      return state;
    }

    const routes = state.routes.slice();
    routes[index] = route;

    return {
      ...state,
      index,
      routes,
    };
  },

  /**
   * Resets all routes.
   * Note that this moves the index to the position to where the last route in the
   * stack is at if the param `index` isn't provided.
   */
  reset(state, routes, index) {
    invariant(
      routes.length && Array.isArray(routes),
      'invalid routes to replace'
    );

    const nextIndex = index === undefined ? routes.length - 1 : index;

    if (state.routes.length === routes.length && state.index === nextIndex) {
      const compare = (route, ii) => routes[ii] === route;
      if (state.routes.every(compare)) {
        return state;
      }
    }

    invariant(!!routes[nextIndex], 'invalid index %s to reset', nextIndex);

    return {
      ...state,
      index: nextIndex,
      routes,
    };
  },
};

export default StateUtils;
