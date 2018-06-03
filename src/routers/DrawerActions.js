const OPEN_DRAWER = 'Navigation/OPEN_DRAWER';
const CLOSE_DRAWER = 'Navigation/CLOSE_DRAWER';
const TOGGLE_DRAWER = 'Navigation/TOGGLE_DRAWER';

const openDrawer = payload => ({
  type: OPEN_DRAWER,
  ...payload,
  suppressAnimation: false,
});

const closeDrawer = payload => ({
  type: CLOSE_DRAWER,
  ...payload,
  suppressAnimation: false,
});

const toggleDrawer = payload => ({
  type: TOGGLE_DRAWER,
  ...payload,
  suppressAnimation: false,
});

export default {
  OPEN_DRAWER,
  CLOSE_DRAWER,
  TOGGLE_DRAWER,

  openDrawer,
  closeDrawer,
  toggleDrawer,
};
