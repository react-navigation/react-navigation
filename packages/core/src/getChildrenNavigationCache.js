export default function getChildrenNavigationCache(navigation) {
  if (!navigation) {
    return {};
  }

  let childrenNavigationCache =
    navigation._childrenNavigation || (navigation._childrenNavigation = {});
  let childKeys = navigation.state.routes.map(route => route.key);
  Object.keys(childrenNavigationCache).forEach(cacheKey => {
    if (!childKeys.includes(cacheKey) && !navigation.state.isTransitioning) {
      delete childrenNavigationCache[cacheKey];
    }
  });

  return navigation._childrenNavigation;
}
