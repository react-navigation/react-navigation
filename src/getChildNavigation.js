import getChildEventSubscriber from './getChildEventSubscriber';
import getChildRouter from './getChildRouter';

const createParamGetter = route => (paramName, defaultValue) => {
  const params = route.params;

  if (params && paramName in params) {
    return params[paramName];
  }

  return defaultValue;
};

function getChildNavigation(navigation, childKey, getCurrentParentNavigation) {
  const children =
    navigation._childrenNavigation || (navigation._childrenNavigation = {});

  const route = navigation.state.routes.find(r => r.key === childKey);

  if (children[childKey] && children[childKey].state === route) {
    return children[childKey];
  }

  const childRouter = getChildRouter(navigation.router, route.routeName);

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
      router: childRouter,
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
    router: childRouter,
    actions: actionCreators,
    getParam: createParamGetter(route),

    getChildNavigation: grandChildKey =>
      getChildNavigation(children[childKey], grandChildKey, () =>
        getCurrentParentNavigation().getChildNavigation(childKey)
      ),

    isFocused: () => {
      const currentNavigation = getCurrentParentNavigation();
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
