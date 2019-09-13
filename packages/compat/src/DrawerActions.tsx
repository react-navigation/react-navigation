import { DrawerActions, DrawerActionType } from '@react-navigation/routers';

export function openDrawer(): DrawerActionType {
  return DrawerActions.openDrawer();
}

export function closeDrawer(): DrawerActionType {
  return DrawerActions.closeDrawer();
}

export function toggleDrawer(): DrawerActionType {
  return DrawerActions.toggleDrawer();
}
