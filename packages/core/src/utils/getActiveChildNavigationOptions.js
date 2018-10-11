const getActiveChildNavigationOptions = (navigation, screenProps) => {
  const { state, router, getChildNavigation } = navigation;
  const activeRoute = state.routes[state.index];
  const activeNavigation = getChildNavigation(activeRoute.key);
  const options = router.getScreenOptions(activeNavigation, screenProps);
  return options;
};

export default getActiveChildNavigationOptions;
