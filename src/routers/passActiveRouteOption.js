const passActiveRouteOption = (nav, optionName, defaultValue = undefined) => {
  const parentNav = nav.dangerouslyGetParent();
  if (!parentNav) {
    return undefined;
  }
  const router = parentNav.router.childRouters[nav.state.routeName];
  const activeRoute = nav.state.routes[nav.state.index];

  const childNav = nav.getChildNavigation(activeRoute.key);
  const opts = router.getScreenOptions(childNav);

  return opts[optionName];
};

export default passActiveRouteOption;
