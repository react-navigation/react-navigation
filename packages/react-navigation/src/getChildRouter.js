export default function getChildRouter(router, routeName) {
  if (router.childRouters && router.childRouters[routeName]) {
    return router.childRouters[routeName];
  }

  const Component = router.getComponentForRouteName(routeName);

  return Component.router;
}
