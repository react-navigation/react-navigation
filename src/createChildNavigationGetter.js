import getChildEventSubscriber from './getChildEventSubscriber';

const createParamGetter = route => (paramName, defaultValue) => {
  const params = route.params;

  if (params && paramName in params) {
    return params[paramName];
  }

  return defaultValue;
};

function createChildNavigationGetter(navigation, childKey) {
  const children =
    navigation.childrenNavigation || (navigation.childrenNavigation = {});

  const route = navigation.state.routes.find(r => r.key === childKey);

  if (children[childKey] && children[childKey].state === route) {
    return children[childKey];
  }

  const childRouters = navigation.router.childRouters || {};

  const actionCreators = {
    ...navigation.actions,
    ...navigation.router.getActionCreators(route, navigation.state.key),
  };
  const actionHelpers = {};
  Object.keys(actionCreators).forEach(actionName => {
    actionHelpers[actionName] = (...args) => {
      const actionCreator = actionCreators[actionName];
      const action = actionCreator(...args);
      navigation.dispatch(action);
    };
  });

  if (children[childKey]) {
    children[childKey] = {
      ...children[childKey],
      ...actionHelpers,
      state: route,
      router: childRouters[route.routeName],
      actions: actionCreators,
      getParam: createParamGetter(route),
    };
    return children[childKey];
  }

  const childSubscriber = getChildEventSubscriber(
    navigation.addListener,
    childKey
  );

  children[childKey] = {
    ...actionHelpers,

    state: route,
    router: childRouters[route.routeName],
    actions: actionCreators,
    getParam: createParamGetter(route),

    getChildNavigation: grandChildKey =>
      createChildNavigationGetter(children[childKey], grandChildKey),

    isFocused: () => {
      const { state } = navigation;
      const focusedRoute = state.routes[state.index];
      return children[childKey].state === focusedRoute;
    },
    dispatch: navigation.dispatch,
    getScreenProps: navigation.getScreenProps,
    dangerouslyGetParent: () => navigation,
    addListener: childSubscriber.addListener,
  };
  return children[childKey];
}

export default createChildNavigationGetter;
