import { TabActions, TabActionType } from '@react-navigation/native';

export function jumpTo({
  routeName,
  key,
}: {
  routeName: string;
  key?: string;
}): TabActionType {
  if (key === undefined) {
    return TabActions.jumpTo(routeName);
  } else {
    return {
      ...TabActions.jumpTo(routeName),
      target: key,
    };
  }
}
