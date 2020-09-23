export default function getChildRouter(router: any, routeName: string) {
  if (router.childRouters?.[routeName]) {
    return router.childRouters[routeName];
  }

  const Component = router.getComponentForRouteName(routeName);

  return Component.router;
}
