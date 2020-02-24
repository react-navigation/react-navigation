import {
  CommonActions,
  StackActions,
  StackActionType,
} from '@react-navigation/native';

export function reset(): CommonActions.Action {
  throw new Error(
    'The legacy `reset` action is not supported. Use the new reset API by accessing the original navigation object at `navigation.original`.'
  );
}

export function replace({
  routeName,
  params,
  key,
  newKey,
  action,
}: {
  routeName: string;
  params?: object;
  key?: string;
  newKey?: string;
  action?: never;
}): StackActionType {
  if (action !== undefined) {
    throw new Error(
      'Sub-actions are not supported for `replace`. Remove the `action` key from the options.'
    );
  }

  return {
    type: 'REPLACE',
    payload: {
      name: routeName,
      key: newKey,
      params,
    },
    ...(key !== undefined ? { source: key } : null),
  };
}

export function push({
  routeName,
  params,
  action,
}: {
  routeName: string;
  params?: object;
  action?: never;
}): StackActionType {
  if (action !== undefined) {
    throw new Error(
      'Sub-actions are not supported for `push`. Remove the `action` key from the options.'
    );
  }

  return StackActions.push(routeName, params);
}

export function pop({ n = 1 }: { n: number }): StackActionType {
  return StackActions.pop(n);
}

export function popToTop(): StackActionType {
  return StackActions.popToTop();
}

export function dismiss(): CommonActions.Action {
  throw new Error('The legacy `dismiss` action is not supported.');
}
