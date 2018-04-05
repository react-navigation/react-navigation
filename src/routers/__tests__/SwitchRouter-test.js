/* eslint react/display-name:0 */

import React from 'react';
import SwitchRouter from '../SwitchRouter';
import StackRouter from '../StackRouter';
import NavigationActions from '../../NavigationActions';

describe('SwitchRouter', () => {
  test('resets the route when unfocusing a tab by default', () => {
    const router = getExampleRouter();
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'A2' },
      state
    );
    expect(state2.routes[0].index).toEqual(1);
    expect(state2.routes[0].routes.length).toEqual(2);

    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'B' },
      state2
    );

    expect(state3.routes[0].index).toEqual(0);
    expect(state3.routes[0].routes.length).toEqual(1);
  });

  test('sets the next state even if no previous state is provided', () => {
    const router = getExampleRouter();
    const initialState = router.getStateForAction({
      type: NavigationActions.INIT,
    });
    const nextState = router.getStateForAction({
      type: NavigationActions.NAVIGATE,
      routeName: 'A2',
    });

    expect(nextState.routes[0].index).toEqual(1);
    expect(nextState.routes[0].routes.length).toEqual(2);
  });

  test('does not reset the route on unfocus if resetOnBlur is false', () => {
    const router = getExampleRouter({ resetOnBlur: false });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'A2' },
      state
    );
    expect(state2.routes[0].index).toEqual(1);
    expect(state2.routes[0].routes.length).toEqual(2);

    const state3 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'B' },
      state2
    );

    expect(state3.routes[0].index).toEqual(1);
    expect(state3.routes[0].routes.length).toEqual(2);
  });

  test('ignores back by default', () => {
    const router = getExampleRouter();
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'B' },
      state
    );
    expect(state2.index).toEqual(1);

    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state2
    );

    expect(state3.index).toEqual(1);
  });

  test('handles back if given a backBehavior', () => {
    const router = getExampleRouter({ backBehavior: 'initialRoute' });
    const state = router.getStateForAction({ type: NavigationActions.INIT });
    const state2 = router.getStateForAction(
      { type: NavigationActions.NAVIGATE, routeName: 'B' },
      state
    );
    expect(state2.index).toEqual(1);

    const state3 = router.getStateForAction(
      { type: NavigationActions.BACK },
      state2
    );

    expect(state3.index).toEqual(0);
  });
});

const getExampleRouter = (config = {}) => {
  const PlainScreen = () => <div />;
  const StackA = () => <div />;
  const StackB = () => <div />;

  StackA.router = StackRouter({
    A1: PlainScreen,
    A2: PlainScreen,
  });

  StackB.router = StackRouter({
    B1: PlainScreen,
    B2: PlainScreen,
  });

  const router = SwitchRouter(
    {
      A: StackA,
      B: StackB,
    },
    {
      initialRouteName: 'A',
      ...config,
    }
  );

  return router;
};
