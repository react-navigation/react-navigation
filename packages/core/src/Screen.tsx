import type { NavigationState, ParamListBase } from '@react-navigation/routers';

import type { EventMapBase, RouteConfig } from './types';

/**
 * Empty component used for specifying route configuration.
 */
export default function Screen<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  State extends NavigationState,
  ScreenOptions extends {},
  EventMap extends EventMapBase
>(_: RouteConfig<ParamList, RouteName, State, ScreenOptions, EventMap>) {
  /* istanbul ignore next */
  return null;
}
