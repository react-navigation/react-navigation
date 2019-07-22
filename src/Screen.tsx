import { RouteConfig, ParamListBase } from './types';

export default function Screen<
  ParamList extends ParamListBase,
  RouteName extends keyof ParamList,
  ScreenOptions extends object
>(_: RouteConfig<ParamList, RouteName, ScreenOptions>) {
  /* istanbul ignore next */
  return null;
}
