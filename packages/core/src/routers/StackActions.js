const POP = 'Navigation/POP';
const POP_TO_TOP = 'Navigation/POP_TO_TOP';
const PUSH = 'Navigation/PUSH';
const RESET = 'Navigation/RESET';
const REPLACE = 'Navigation/REPLACE';
const COMPLETE_TRANSITION = 'Navigation/COMPLETE_TRANSITION';

const pop = payload => ({
  type: POP,
  ...payload,
});

const popToTop = payload => ({
  type: POP_TO_TOP,
  ...payload,
});

const push = payload => ({
  type: PUSH,
  ...payload,
});

const reset = payload => ({
  type: RESET,
  key: null,
  ...payload,
});

const replace = payload => ({
  type: REPLACE,
  ...payload,
});

const completeTransition = payload => ({
  type: COMPLETE_TRANSITION,
  ...payload,
});

export default {
  POP,
  POP_TO_TOP,
  PUSH,
  RESET,
  REPLACE,
  COMPLETE_TRANSITION,

  pop,
  popToTop,
  push,
  reset,
  replace,
  completeTransition,
};
