import { ParamListBase } from '@react-navigation/routers';
import { RouteConfig } from './types';

/**
 * Empty component used for specifying route configuration.
 */
export default function Screen<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  ScreenOptions extends object
>(_: RouteConfig<ParamList, RouteName, ScreenOptions>) {
  /* istanbul ignore next */
  return null;
}
