import NavigationActions from '../NavigationActions';

const getNavigationActionCreators = route => {
  return {
    goBack: key => {
      let actualizedKey = key;
      if (key === undefined && navigation.state.key) {
        invariant(
          typeof navigation.state.key === 'string',
          'key should be a string'
        );
        actualizedKey = navigation.state.key;
      }
      return NavigationActions.back({ key: actualizedKey });
    },
    navigate: (navigateTo, params, action) => {
      if (typeof navigateTo === 'string') {
        return NavigationActions.navigate({
          routeName: navigateTo,
          params,
          action,
        });
      }
      invariant(
        typeof navigateTo === 'object',
        'Must navigateTo an object or a string'
      );
      invariant(
        params == null,
        'Params must not be provided to .navigate() when specifying an object'
      );
      invariant(
        action == null,
        'Child action must not be provided to .navigate() when specifying an object'
      );
      return NavigationActions.navigate(navigateTo);
    },
    setParams: params => {
      invariant(
        navigation.state.key && typeof navigation.state.key === 'string',
        'setParams cannot be called by root navigator'
      );
      const key = navigation.state.key;
      return NavigationActions.setParams({ params, key });
    },
  };
};

export default getNavigationActionCreators;
