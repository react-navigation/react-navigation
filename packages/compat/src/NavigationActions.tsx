import { CommonActions } from '@react-navigation/core';

export function navigate({
  routeName,
  params,
  key,
  action,
}: {
  routeName: string;
  params?: object;
  key?: string;
  action?: never;
}): CommonActions.Action {
  if (action !== undefined) {
    throw new Error(
      'Sub-actions are not supported for `navigate`. Remove the `action` key from the options.'
    );
  }

  return CommonActions.navigate({
    name: routeName,
    key: key,
    params: params,
  });
}

export function back(options?: { key: null | never }): CommonActions.Action {
  if (options !== undefined && options.key != null) {
    throw new Error(
      "The legacy `back` action with a key is not supported. To go back from a specific route, you need to specify both route key and the navigator's state key in the action: `{ ...CommonActions.goBack(), source: route.key, target: state.key }`."
    );
  }

  return CommonActions.goBack();
}

export function setParams({
  params,
  key,
}: {
  params: object;
  key?: string;
}): CommonActions.Action {
  return {
    ...CommonActions.setParams(params),
    ...(key !== undefined ? { source: key } : null),
  };
}
