export const POP = 'Navigation/POP';
export const POP_TO_TOP = 'Navigation/POP_TO_TOP';
export const PUSH = 'Navigation/PUSH';
export const RESET = 'Navigation/RESET';
export const REPLACE = 'Navigation/REPLACE';
export const COMPLETE_TRANSITION = 'Navigation/COMPLETE_TRANSITION';

export const pop = payload => ({
  type: POP,
  ...payload,
});

export const popToTop = payload => ({
  type: POP_TO_TOP,
  ...payload,
});

export const push = payload => ({
  type: PUSH,
  ...payload,
});

export const reset = payload => ({
  type: RESET,
  key: null,
  ...payload,
});

export const replace = payload => ({
  type: REPLACE,
  ...payload,
});

export const completeTransition = payload => ({
  type: COMPLETE_TRANSITION,
  preserveFocus: true,
  ...payload,
});
