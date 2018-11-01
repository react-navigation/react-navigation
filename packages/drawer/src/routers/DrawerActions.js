const OPEN_DRAWER = 'Navigation/OPEN_DRAWER';
const CLOSE_DRAWER = 'Navigation/CLOSE_DRAWER';
const TOGGLE_DRAWER = 'Navigation/TOGGLE_DRAWER';
const DRAWER_OPENED = 'Navigation/DRAWER_OPENED';
const DRAWER_CLOSED = 'Navigation/DRAWER_CLOSED';
const MARK_DRAWER_ACTIVE = 'Navigation/MARK_DRAWER_ACTIVE';
const MARK_DRAWER_SETTLING = 'Navigation/MARK_DRAWER_SETTLING';
const MARK_DRAWER_IDLE = 'Navigation/MARK_DRAWER_IDLE';

const openDrawer = payload => ({
  type: OPEN_DRAWER,
  ...payload,
});

const closeDrawer = payload => ({
  type: CLOSE_DRAWER,
  ...payload,
});

const markDrawerActive = payload => ({
  type: MARK_DRAWER_ACTIVE,
  ...payload,
});

const markDrawerIdle = payload => ({
  type: MARK_DRAWER_IDLE,
  ...payload,
});

const markDrawerSettling = payload => ({
  type: MARK_DRAWER_SETTLING,
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
  MARK_DRAWER_ACTIVE,
  MARK_DRAWER_IDLE,
  MARK_DRAWER_SETTLING,

  openDrawer,
  closeDrawer,
  toggleDrawer,
  markDrawerIdle,
  markDrawerActive,
  markDrawerSettling,
};
