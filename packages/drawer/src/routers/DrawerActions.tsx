export const OPEN_DRAWER = 'Navigation/OPEN_DRAWER';
export const CLOSE_DRAWER = 'Navigation/CLOSE_DRAWER';
export const TOGGLE_DRAWER = 'Navigation/TOGGLE_DRAWER';
export const DRAWER_OPENED = 'Navigation/DRAWER_OPENED';
export const DRAWER_CLOSED = 'Navigation/DRAWER_CLOSED';
export const MARK_DRAWER_ACTIVE = 'Navigation/MARK_DRAWER_ACTIVE';
export const MARK_DRAWER_SETTLING = 'Navigation/MARK_DRAWER_SETTLING';
export const MARK_DRAWER_IDLE = 'Navigation/MARK_DRAWER_IDLE';

export type DrawerActionType =
  | typeof OPEN_DRAWER
  | typeof CLOSE_DRAWER
  | typeof TOGGLE_DRAWER;

export const openDrawer = (payload?: any) => ({
  type: OPEN_DRAWER,
  ...payload,
});

export const closeDrawer = (payload?: any) => ({
  type: CLOSE_DRAWER,
  ...payload,
});

export const toggleDrawer = (payload?: any) => ({
  type: TOGGLE_DRAWER,
  ...payload,
});
