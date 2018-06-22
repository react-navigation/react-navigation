const OPEN_DRAWER = 'Navigation/OPEN_DRAWER';
const CLOSE_DRAWER = 'Navigation/CLOSE_DRAWER';
const TOGGLE_DRAWER = 'Navigation/TOGGLE_DRAWER';
const DRAWER_OPENED = 'Navigation/DRAWER_OPENED';
const DRAWER_CLOSED = 'Navigation/DRAWER_CLOSED';

const openDrawer = payload => ({
  type: OPEN_DRAWER,
  ...payload,
});

const closeDrawer = payload => ({
  type: CLOSE_DRAWER,
  ...payload,
});

const toggleDrawer = payload => ({
  type: TOGGLE_DRAWER,
  ...payload,
});

export default {
  OPEN_DRAWER,
  CLOSE_DRAWER,
  TOGGLE_DRAWER,
  DRAWER_OPENED,
  DRAWER_CLOSED,

  openDrawer,
  closeDrawer,
  toggleDrawer,
};
