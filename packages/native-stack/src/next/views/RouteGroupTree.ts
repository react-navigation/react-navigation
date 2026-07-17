import type { Route } from '@react-navigation/native';

export type RouteGroup = {
  routes: Route<string>[];
  sheetRoute?: Route<string> | undefined;
  children: RouteGroup[];
};

// A form sheet is a leaf presentation. Routes pushed by a navigator rendered
// inside the sheet belong to that navigator, not to this native stack. Keep
// every sheet in its own group directly under the regular card group so we do
// not create a Stack.Host inside FormSheet or move later card routes into it.
// Popped sheets stay as siblings while their native closing animation runs.
export function buildRouteGroupTree({
  routes,
  renderedRoutes,
  isFormSheet,
  getAnchorRouteKey,
}: {
  routes: Route<string>[];
  renderedRoutes: Route<string>[];
  isFormSheet: (route: Route<string>) => boolean;
  getAnchorRouteKey: (key: string) => string | undefined;
}): RouteGroup {
  const rootGroup: RouteGroup = { routes: [], children: [] };
  const groupByRouteKey = new Map<string, RouteGroup>();

  routes.forEach((route, index) => {
    // A native stack always needs a regular base screen under any sheets.
    if (index !== 0 && isFormSheet(route)) {
      const group: RouteGroup = { routes: [], sheetRoute: route, children: [] };

      rootGroup.children.push(group);
      groupByRouteKey.set(route.key, group);
    } else {
      groupByRouteKey.set(route.key, rootGroup);
    }
  });

  for (const route of renderedRoutes) {
    let group = groupByRouteKey.get(route.key);

    if (group == null) {
      // The anchor tells us that the route was presented above another route,
      // rather than being the stack's first route. Keep a popped form sheet in
      // its own leaf group while its native closing animation is still running.
      const anchorKey = getAnchorRouteKey(route.key);
      if (anchorKey != null && isFormSheet(route)) {
        group = { routes: [], sheetRoute: route, children: [] };

        rootGroup.children.push(group);
      } else {
        group = rootGroup;
      }

      groupByRouteKey.set(route.key, group);
    }

    group.routes.push(route);
  }

  return rootGroup;
}
