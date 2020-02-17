import { DrawerActions, DrawerActionType } from '@react-navigation/native';

export function openDrawer(): DrawerActionType {
  return DrawerActions.openDrawer();
}

export function closeDrawer(): DrawerActionType {
  return DrawerActions.closeDrawer();
}

export function toggleDrawer(): DrawerActionType {
  return DrawerActions.toggleDrawer();
}
