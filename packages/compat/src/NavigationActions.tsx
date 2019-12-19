import { CommonActions, NavigationState } from '@react-navigation/native';

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

export function back(options?: { key?: null | string }) {
  return options?.key != null
    ? (state: NavigationState) => ({
        ...CommonActions.goBack(),
        source: options.key,
        target: state.key,
      })
    : CommonActions.goBack();
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
