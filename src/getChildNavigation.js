import getChildEventSubscriber from './getChildEventSubscriber';
import getChildRouter from './getChildRouter';
import getNavigationActionCreators from './routers/getNavigationActionCreators';
import getChildrenNavigationCache from './getChildrenNavigationCache';
import invariant from './utils/invariant';

const createParamGetter = route => (paramName, defaultValue) => {
  const params = route.params;

  if (params && paramName in params) {
    return params[paramName];
  }

  return defaultValue;
};

function getChildNavigation(navigation, childKey, getCurrentParentNavigation) {
  const children = getChildrenNavigationCache(navigation);

  const childRoute = navigation.state.routes.find(r => r.key === childKey);

  if (!childRoute) {
    return null;
  }

  if (children[childKey] && children[childKey].state === childRoute) {
    return children[childKey];
  }

  const childRouter = getChildRouter(navigation.router, childRoute.routeName);

  // If the route has children, we'll use this to pass in to the action creators
  // for the childRouter so that any action that depends on the active route will
  // behave as expected. We don't explicitly require that routers implement routes
  // and index properties, but if we did then we would put an invariant here to
  // ensure that a focusedGrandChildRoute exists if childRouter is defined.
  const focusedGrandChildRoute =
    childRoute.routes && typeof childRoute.index === 'number'
      ? childRoute.routes[childRoute.index]
      : null;

  const actionCreators = {
    ...navigation.actions,
    ...navigation.router.getActionCreators(childRoute, navigation.state.key),
    ...(childRouter
      ? childRouter.getActionCreators(focusedGrandChildRoute, childRoute.key)
      : {}),
    ...getNavigationActionCreators(childRoute),
  };

  const actionHelpers = {};
  Object.keys(actionCreators).forEach(actionName => {
    actionHelpers[actionName] = (...args) => {
      const actionCreator = actionCreators[actionName];
      const action = actionCreator(...args);
      return navigation.dispatch(action);
    };
  });

  if (children[childKey]) {
    children[childKey] = {
      ...children[childKey],
      ...actionHelpers,
      state: childRoute,
      router: childRouter,
      actions: actionCreators,
      getParam: createParamGetter(childRoute),
    };
    return children[childKey];
  }

  const childSubscriber = getChildEventSubscriber(
    navigation.addListener,
    childKey
  );

  children[childKey] = {
    ...actionHelpers,

    state: childRoute,
    router: childRouter,
    actions: actionCreators,
    getParam: createParamGetter(childRoute),

    getChildNavigation: grandChildKey =>
      getChildNavigation(children[childKey], grandChildKey, () => {
        const nav = getCurrentParentNavigation();
        return nav && nav.getChildNavigation(childKey);
      }),

    isFocused: () => {
      const currentNavigation = getCurrentParentNavigation();
      if (!currentNavigation) {
        return false;
      }
      const { routes, index } = currentNavigation.state;
      if (!currentNavigation.isFocused()) {
        return false;
      }
      if (routes[index].key === childKey) {
        return true;
      }
      return false;
    },
    dispatch: navigation.dispatch,
    getScreenProps: navigation.getScreenProps,
    dangerouslyGetParent: getCurrentParentNavigation,
    addListener: childSubscriber.addListener,
  };
  return children[childKey];
}

export default getChildNavigation;
