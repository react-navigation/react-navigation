import { ParamListBase, NavigationState } from '@react-navigation/routers';
import { RouteConfig, EventMapBase } from './types';

/**
 * Empty component used for specifying route configuration.
 */
export default function Screen<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  State extends NavigationState,
  ScreenOptions extends object,
  EventMap extends EventMapBase
>(_: RouteConfig<ParamList, RouteName, State, ScreenOptions, EventMap>) {
  /* istanbul ignore next */
  return null;
}
