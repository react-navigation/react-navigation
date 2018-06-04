import getNavigationActionCreators from './routers/getNavigationActionCreators';
import getChildNavigation from './getChildNavigation';

export default function getNavigation(
  router,
  state,
  dispatch,
  actionSubscribers,
  getScreenProps,
  getCurrentNavigation
) {
  const navigation = {
    router,
    state,
    dispatch,
    getScreenProps,
    getChildNavigation: childKey =>
      getChildNavigation(navigation, childKey, getCurrentNavigation),
    isFocused: childKey => {
      const { routes, index } = getCurrentNavigation().state;
      console.log('Top level isFocused!', childKey, index, routes[index].key);
      if (childKey == null || routes[index].key === childKey) {
        return true;
      }
      return false;
    },
    addListener: (eventName, handler) => {
      if (eventName !== 'action') {
        return { remove: () => {} };
      }
      actionSubscribers.add(handler);
      return {
        remove: () => {
          actionSubscribers.delete(handler);
        },
      };
    },
    dangerouslyGetParent: () => null,
  };

  const actionCreators = getNavigationActionCreators(navigation.state);

  Object.keys(actionCreators).forEach(actionName => {
    navigation[actionName] = (...args) =>
      navigation.dispatch(actionCreators[actionName](...args));
  });

  return navigation;
}
