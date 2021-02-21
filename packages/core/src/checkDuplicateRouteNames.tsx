import type { NavigationState, PartialState } from '@react-navigation/routers';

export default function checkDuplicateRouteNames(state: NavigationState) {
  const allRouteNames = new Map<string, string[]>();

  const getRouteNames = (
    location: string,
    state: NavigationState | PartialState<NavigationState>
  ) => {
    state.routeNames?.forEach((name) => {
      const current = allRouteNames.get(name);
      const currentLocation = location ? `${location} > ${name}` : name;

      if (current) {
        current.push(currentLocation);
      } else {
        allRouteNames.set(name, [currentLocation]);
      }
    });

    state.routes.forEach((route: typeof state.routes[0]) => {
      if (route.state) {
        getRouteNames(
          location ? `${location} > ${route.name}` : route.name,
          route.state
        );
      }
    });
  };

  getRouteNames('', state);

  const duplicates = Array.from(allRouteNames.entries()).filter(
    ([_, value]) => value.length > 1
  );

  return duplicates;
}
