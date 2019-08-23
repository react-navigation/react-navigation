const getActiveChildNavigationOptions = (
  navigation,
  screenProps,
  theme = 'light'
) => {
  const { state, router, getChildNavigation } = navigation;
  const activeRoute = state.routes[state.index];
  const activeNavigation = getChildNavigation(activeRoute.key);
  const options = router.getScreenOptions(activeNavigation, screenProps, theme);
  return options;
};

export default getActiveChildNavigationOptions;
