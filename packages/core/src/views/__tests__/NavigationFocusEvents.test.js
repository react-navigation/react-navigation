import * as React from 'react';
import renderer from 'react-test-renderer';
import NavigationFocusEvents from '../NavigationFocusEvents';
import getEventManager from '../../getEventManager';
import { NavigationActions, StackActions } from '@react-navigation/core';

const getNavigationMock = (mock = {}) => {
  const { addListener, emit } = getEventManager('target');

  return {
    state: {
      routes: [
        { key: 'a', routeName: 'foo' },
        { key: 'b', routeName: 'bar' },
      ],
      index: 0,
    },
    isFocused: () => true,
    addListener: jest.fn(addListener),
    emit: emit,
    dangerouslyGetParent: () => null,
    ...mock,
  };
};

it('emits refocus event with current route key on refocus', () => {
  const navigation = getNavigationMock();
  const onEvent = jest.fn();

  renderer.create(
    <NavigationFocusEvents navigation={navigation} onEvent={onEvent} />
  );

  navigation.emit('refocus');

  expect(onEvent).toHaveBeenCalledTimes(1);
  const key = navigation.state.routes[navigation.state.index].key;
  expect(onEvent).toHaveBeenCalledWith(key, 'refocus');
});

describe('on navigation action emitted', () => {
  it('does not emit if navigation is not focused', () => {
    const navigation = getNavigationMock({
      isFocused: () => false,
    });
    const onEvent = jest.fn();

    renderer.create(
      <NavigationFocusEvents navigation={navigation} onEvent={onEvent} />
    );

    navigation.emit('action', {
      state: navigation.state,
      action: NavigationActions.init(),
      type: 'action',
    });

    expect(onEvent).not.toHaveBeenCalled();
  });

  it('emits only willFocus and willBlur if state is transitioning', () => {
    const state = {
      routes: [
        { key: 'First', routeName: 'First' },
        { key: 'Second', routeName: 'Second' },
      ],
      index: 1,
      routeKeyHistory: ['First', 'Second'],
      isTransitioning: true,
    };
    const action = NavigationActions.init();

    const navigation = getNavigationMock({
      state: state,
    });
    const onEvent = jest.fn();

    renderer.create(
      <NavigationFocusEvents navigation={navigation} onEvent={onEvent} />
    );

    const lastState = {
      routes: [
        { key: 'First', routeName: 'First' },
        { key: 'Second', routeName: 'Second' },
      ],
      index: 0,
      routeKeyHistory: ['First'],
    };
    navigation.emit('action', {
      state,
      lastState,
      action,
      type: 'action',
    });

    const expectedPayload = {
      action,
      state: { key: 'Second', routeName: 'Second' },
      lastState: { key: 'First', routeName: 'First' },
      context: 'Second:Navigation/INIT_Root',
      type: 'action',
    };

    expect(onEvent.mock.calls).toEqual([
      ['Second', 'willFocus', expectedPayload],
      ['First', 'willBlur', expectedPayload],
      ['Second', 'action', expectedPayload],
    ]);
  });

  it('emits didFocus after willFocus and didBlur after willBlur if no transitions', () => {
    const state = {
      routes: [
        { key: 'First', routeName: 'First' },
        { key: 'Second', routeName: 'Second' },
      ],
      index: 1,
      routeKeyHistory: ['First', 'Second'],
    };
    const action = NavigationActions.navigate({
      routeName: 'Second',
    });

    const navigation = getNavigationMock({
      state: state,
    });
    const onEvent = jest.fn();

    renderer.create(
      <NavigationFocusEvents navigation={navigation} onEvent={onEvent} />
    );

    const lastState = {
      routes: [
        { key: 'First', routeName: 'First' },
        { key: 'Second', routeName: 'Second' },
      ],
      index: 0,
      routeKeyHistory: ['First'],
    };
    navigation.emit('action', {
      state,
      lastState,
      action,
      type: 'action',
    });

    const expectedPayload = {
      action,
      state: { key: 'Second', routeName: 'Second' },
      lastState: { key: 'First', routeName: 'First' },
      context: 'Second:Navigation/NAVIGATE_Root',
      type: 'action',
    };

    expect(onEvent.mock.calls).toEqual([
      ['Second', 'willFocus', expectedPayload],
      ['Second', 'didFocus', expectedPayload],
      ['First', 'willBlur', expectedPayload],
      ['First', 'didBlur', expectedPayload],
      ['Second', 'action', expectedPayload],
    ]);
  });

  it('emits didBlur and didFocus when transition ends', () => {
    const initialState = {
      routes: [
        { key: 'First', routeName: 'First' },
        { key: 'Second', routeName: 'Second' },
      ],
      index: 0,
      routeKeyHistory: ['First'],
      isTransitioning: true,
    };
    const intermediateState = {
      routes: [
        { key: 'First', routeName: 'First' },
        { key: 'Second', routeName: 'Second' },
      ],
      index: 1,
      routeKeyHistory: ['First', 'Second'],
      isTransitioning: true,
    };
    const finalState = {
      routes: [
        { key: 'First', routeName: 'First' },
        { key: 'Second', routeName: 'Second' },
      ],
      index: 1,
      routeKeyHistory: ['First', 'Second'],
      isTransitioning: false,
    };
    const actionNavigate = NavigationActions.navigate({ routeName: 'Second' });
    const actionEndTransition = StackActions.completeTransition({
      key: 'Second',
    });

    const navigation = getNavigationMock({
      state: intermediateState,
    });
    const onEvent = jest.fn();

    renderer.create(
      <NavigationFocusEvents navigation={navigation} onEvent={onEvent} />
    );

    navigation.emit('action', {
      state: intermediateState,
      lastState: initialState,
      action: actionNavigate,
      type: 'action',
    });

    const expectedPayloadNavigate = {
      action: actionNavigate,
      state: { key: 'Second', routeName: 'Second' },
      lastState: { key: 'First', routeName: 'First' },
      context: 'Second:Navigation/NAVIGATE_Root',
      type: 'action',
    };

    expect(onEvent.mock.calls).toEqual([
      ['Second', 'willFocus', expectedPayloadNavigate],
      ['First', 'willBlur', expectedPayloadNavigate],
      ['Second', 'action', expectedPayloadNavigate],
    ]);
    onEvent.mockClear();

    navigation.emit('action', {
      state: finalState,
      lastState: intermediateState,
      action: actionEndTransition,
      type: 'action',
    });

    const expectedPayloadEndTransition = {
      action: actionEndTransition,
      state: { key: 'Second', routeName: 'Second' },
      lastState: { key: 'Second', routeName: 'Second' },
      context: 'Second:Navigation/COMPLETE_TRANSITION_Root',
      type: 'action',
    };

    expect(onEvent.mock.calls).toEqual([
      ['First', 'didBlur', expectedPayloadEndTransition],
      ['Second', 'didFocus', expectedPayloadEndTransition],
      ['Second', 'action', expectedPayloadEndTransition],
    ]);
  });
});

describe('on willFocus emitted', () => {
  it('emits didFocus after willFocus if no transition', () => {
    const navigation = getNavigationMock({
      state: {
        routes: [
          { key: 'FirstLanding', routeName: 'FirstLanding' },
          { key: 'Second', routeName: 'Second' },
        ],
        index: 0,
        key: 'First',
        routeName: 'First',
      },
    });
    const onEvent = jest.fn();

    renderer.create(
      <NavigationFocusEvents navigation={navigation} onEvent={onEvent} />
    );

    const lastState = { key: 'Third', routeName: 'Third' };
    const action = NavigationActions.navigate({ routeName: 'First' });

    navigation.emit('willFocus', {
      lastState,
      action,
      context: 'First:Navigation/NAVIGATE_Root',
      type: 'action',
    });

    const expectedPayload = {
      action,
      state: { key: 'FirstLanding', routeName: 'FirstLanding' },
      context:
        'FirstLanding:Navigation/NAVIGATE_First:Navigation/NAVIGATE_Root',
      type: 'action',
    };

    expect(onEvent.mock.calls).toEqual([
      ['FirstLanding', 'willFocus', expectedPayload],
      ['FirstLanding', 'didFocus', expectedPayload],
    ]);

    onEvent.mockClear();

    // the nested navigator might emit a didFocus that should be ignored
    navigation.emit('didFocus', {
      lastState,
      action,
      context: 'First:Navigation/NAVIGATE_Root',
      type: 'action',
    });

    expect(onEvent).not.toHaveBeenCalled();
  });
});
