import * as NavigationActions from '../../NavigationActions';
import * as SwitchActions from '../../routers/SwitchActions';
import * as StackActions from '../../routers/StackActions';

// A simple helper that makes it easier to write basic routing tests
// We generally want to apply one action after the other and check router returns correct state
// it's often convenient to manipulate a structure that keeps the router state to avoid
// creating many state1, state2, state3 local variables which are prone to typos...

const defaultOptions = {
  skipInitializeState: false,
};

export const getRouterTestHelper = (router, options = defaultOptions) => {
  let state =
    options && options.skipInitializeState
      ? undefined
      : router.getStateForAction({ type: NavigationActions.INIT });

  const applyAction = action => {
    state = router.getStateForAction(action, state);
  };

  const navigateTo = (routeName, otherActionAttributes) =>
    applyAction({
      type: NavigationActions.NAVIGATE,
      routeName,
      ...otherActionAttributes,
    });

  const jumpTo = (routeName, otherActionAttributes) =>
    applyAction({
      type: SwitchActions.JUMP_TO,
      routeName,
      ...otherActionAttributes,
    });

  const back = key =>
    applyAction({
      type: NavigationActions.BACK,
      key,
    });

  const pop = () =>
    applyAction({
      type: StackActions.POP,
    });

  const popToTop = () =>
    applyAction({
      type: StackActions.POP_TO_TOP,
    });

  const getState = () => state;

  const getSubState = (level = 1) => {
    return getSubStateRecursive(state, level);
  };

  return {
    applyAction,
    navigateTo,
    jumpTo,
    back,
    pop,
    popToTop,
    getState,
    getSubState,
  };
};

const getSubStateRecursive = (state, level = 1) => {
  if (level === 0) {
    return state;
  } else {
    const directSubState = state.routes[state.index];
    return getSubStateRecursive(directSubState, level - 1);
  }
};
