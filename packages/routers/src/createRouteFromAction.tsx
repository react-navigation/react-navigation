import { createParamsFromAction } from './createParamsFromAction';
import type { ParamListBase } from './types';

type Options = {
  action: {
    payload: {
      name: string;
      params?: object | undefined;
    };
  };
  routeParamList: ParamListBase;
  uid: () => string;
};

export function createRouteFromAction({
  action,
  routeParamList,
  uid,
}: Options) {
  const { name } = action.payload;

  return {
    key: `${name}-${uid()}`,
    name,
    params: createParamsFromAction({ action, routeParamList }),
  };
}
