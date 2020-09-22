import * as NavigationActions from './NavigationActions';
import * as StackActions from './StackActions';
import * as SwitchActions from './SwitchActions';
import * as DrawerActions from './DrawerActions';

type NavigateActionPayload = Parameters<typeof NavigationActions.navigate>['0'];

type NavigateActionType = ReturnType<typeof NavigationActions.navigate>;

export function navigate(
  routeName: string,
  params?: object,
  action?: never
): NavigateActionType;
// eslint-disable-next-line no-redeclare
export function navigate(options: NavigateActionPayload): NavigateActionType;
// eslint-disable-next-line no-redeclare
export function navigate(
  options: string | NavigateActionPayload,
  params?: object,
  action?: never
): NavigateActionType {
  if (typeof options === 'string') {
    return NavigationActions.navigate({
      routeName: options,
      params,
      action,
    });
  }

  return NavigationActions.navigate(options);
}

export function goBack(fromKey?: null | string) {
  return NavigationActions.back({ key: fromKey });
}

export function setParams(params: object) {
  return NavigationActions.setParams({ params });
}

export function reset() {
  return StackActions.reset();
}

export function replace(routeName: string, params?: object, action?: never) {
  return StackActions.replace({
    routeName,
    params,
    action,
  });
}

export function push(routeName: string, params?: object, action?: never) {
  return StackActions.push({
    routeName,
    params,
    action,
  });
}

export function pop(n: number = 1) {
  return StackActions.pop(typeof n === 'number' ? { n } : n);
}

export function popToTop() {
  return StackActions.popToTop();
}

export function dismiss() {
  return StackActions.dismiss();
}

export function jumpTo(routeName: string) {
  return SwitchActions.jumpTo({ routeName });
}

export function openDrawer() {
  return DrawerActions.openDrawer();
}

export function closeDrawer() {
  return DrawerActions.closeDrawer();
}

export function toggleDrawer() {
  return DrawerActions.toggleDrawer();
}
