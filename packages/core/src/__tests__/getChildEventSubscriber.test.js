import getChildEventSubscriber from '../getChildEventSubscriber';

it('child action events only flow when focused', () => {
  const parentSubscriber = jest.fn();
  const emitParentAction = payload => {
    parentSubscriber.mock.calls.forEach(subs => {
      if (subs[0] === payload.type) {
        subs[1](payload);
      }
    });
  };
  const subscriptionRemove = () => {};
  parentSubscriber.mockReturnValueOnce({ remove: subscriptionRemove });
  const childEventSubscriber = getChildEventSubscriber(parentSubscriber, 'key1')
    .addListener;
  const testState = {
    key: 'foo',
    routeName: 'FooRoute',
    routes: [{ key: 'key0' }, { key: 'key1' }],
    index: 0,
    isTransitioning: false,
  };
  const focusedTestState = {
    ...testState,
    index: 1,
  };
  const childActionHandler = jest.fn();
  const childWillFocusHandler = jest.fn();
  const childDidFocusHandler = jest.fn();
  childEventSubscriber('action', childActionHandler);
  childEventSubscriber('willFocus', childWillFocusHandler);
  childEventSubscriber('didFocus', childDidFocusHandler);
  emitParentAction({
    type: 'action',
    state: focusedTestState,
    lastState: testState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(0);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
  emitParentAction({
    type: 'action',
    state: focusedTestState,
    lastState: focusedTestState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(1);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
});

it('grandchildren subscription', () => {
  const grandParentSubscriber = jest.fn();
  const emitGrandParentAction = payload => {
    grandParentSubscriber.mock.calls.forEach(subs => {
      if (subs[0] === payload.type) {
        subs[1](payload);
      }
    });
  };
  const subscriptionRemove = () => {};
  grandParentSubscriber.mockReturnValueOnce({ remove: subscriptionRemove });
  const parentSubscriber = getChildEventSubscriber(
    grandParentSubscriber,
    'parent'
  ).addListener;
  const childEventSubscriber = getChildEventSubscriber(parentSubscriber, 'key1')
    .addListener;
  const parentBlurState = {
    key: 'foo',
    routeName: 'FooRoute',
    routes: [
      { key: 'aunt' },
      {
        key: 'parent',
        routes: [{ key: 'key0' }, { key: 'key1' }],
        index: 1,
        isTransitioning: false,
      },
    ],
    index: 0,
    isTransitioning: false,
  };
  const parentTransitionState = {
    ...parentBlurState,
    index: 1,
    isTransitioning: true,
  };
  const parentFocusState = {
    ...parentTransitionState,
    isTransitioning: false,
  };
  const childActionHandler = jest.fn();
  const childWillFocusHandler = jest.fn();
  const childDidFocusHandler = jest.fn();
  childEventSubscriber('action', childActionHandler);
  childEventSubscriber('willFocus', childWillFocusHandler);
  childEventSubscriber('didFocus', childDidFocusHandler);
  emitGrandParentAction({
    type: 'action',
    state: parentTransitionState,
    lastState: parentBlurState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(0);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(0);
  emitGrandParentAction({
    type: 'action',
    state: parentFocusState,
    lastState: parentTransitionState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(0);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
});

it('grandchildren transitions', () => {
  const grandParentSubscriber = jest.fn();
  const emitGrandParentAction = payload => {
    grandParentSubscriber.mock.calls.forEach(subs => {
      if (subs[0] === payload.type) {
        subs[1](payload);
      }
    });
  };
  const subscriptionRemove = () => {};
  grandParentSubscriber.mockReturnValueOnce({ remove: subscriptionRemove });
  const parentSubscriber = getChildEventSubscriber(
    grandParentSubscriber,
    'parent'
  ).addListener;
  const childEventSubscriber = getChildEventSubscriber(parentSubscriber, 'key1')
    .addListener;
  const makeFakeState = (childIndex, childIsTransitioning) => ({
    index: 1,
    isTransitioning: false,
    routes: [
      { key: 'nothing' },
      {
        key: 'parent',
        index: childIndex,
        isTransitioning: childIsTransitioning,
        routes: [{ key: 'key0' }, { key: 'key1' }, { key: 'key2' }],
      },
    ],
  });
  const blurredState = makeFakeState(0, false);
  const transitionState = makeFakeState(1, true);
  const focusState = makeFakeState(1, false);
  const transition2State = makeFakeState(2, true);
  const blurred2State = makeFakeState(2, false);

  const childActionHandler = jest.fn();
  const childWillFocusHandler = jest.fn();
  const childDidFocusHandler = jest.fn();
  const childWillBlurHandler = jest.fn();
  const childDidBlurHandler = jest.fn();
  childEventSubscriber('action', childActionHandler);
  childEventSubscriber('willFocus', childWillFocusHandler);
  childEventSubscriber('didFocus', childDidFocusHandler);
  childEventSubscriber('willBlur', childWillBlurHandler);
  childEventSubscriber('didBlur', childDidBlurHandler);
  emitGrandParentAction({
    type: 'action',
    state: transitionState,
    lastState: blurredState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(0);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(0);
  emitGrandParentAction({
    type: 'action',
    state: focusState,
    lastState: transitionState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(0);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
  emitGrandParentAction({
    type: 'action',
    state: focusState,
    lastState: focusState,
    action: { type: 'TestAction' },
  });
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
  expect(childActionHandler.mock.calls.length).toBe(1);
  emitGrandParentAction({
    type: 'action',
    state: transition2State,
    lastState: focusState,
    action: { type: 'CauseWillBlurAction' },
  });
  expect(childWillBlurHandler.mock.calls.length).toBe(1);
  expect(childDidBlurHandler.mock.calls.length).toBe(0);
  expect(childActionHandler.mock.calls.length).toBe(1);
  emitGrandParentAction({
    type: 'action',
    state: blurred2State,
    lastState: transition2State,
    action: { type: 'CauseDidBlurAction' },
  });
  expect(childWillBlurHandler.mock.calls.length).toBe(1);
  expect(childDidBlurHandler.mock.calls.length).toBe(1);
  expect(childActionHandler.mock.calls.length).toBe(1);
});

it('grandchildren pass through transitions', () => {
  const grandParentSubscriber = jest.fn();
  const emitGrandParentAction = payload => {
    grandParentSubscriber.mock.calls.forEach(subs => {
      if (subs[0] === payload.type) {
        subs[1](payload);
      }
    });
  };
  const subscriptionRemove = () => {};
  grandParentSubscriber.mockReturnValueOnce({ remove: subscriptionRemove });
  const parentSubscriber = getChildEventSubscriber(
    grandParentSubscriber,
    'parent'
  ).addListener;
  const childEventSubscriber = getChildEventSubscriber(parentSubscriber, 'key1')
    .addListener;
  const makeFakeState = (childIndex, childIsTransitioning) => ({
    index: childIndex,
    isTransitioning: childIsTransitioning,
    routes: [
      { key: 'nothing' },
      {
        key: 'parent',
        index: 1,
        isTransitioning: false,
        routes: [{ key: 'key0' }, { key: 'key1' }, { key: 'key2' }],
      },
    ].slice(0, childIndex + 1),
  });
  const blurredState = makeFakeState(0, false);
  const transitionState = makeFakeState(1, true);
  const focusState = makeFakeState(1, false);
  const transition2State = makeFakeState(0, true);
  const blurred2State = makeFakeState(0, false);

  const childActionHandler = jest.fn();
  const childWillFocusHandler = jest.fn();
  const childDidFocusHandler = jest.fn();
  const childWillBlurHandler = jest.fn();
  const childDidBlurHandler = jest.fn();
  childEventSubscriber('action', childActionHandler);
  childEventSubscriber('willFocus', childWillFocusHandler);
  childEventSubscriber('didFocus', childDidFocusHandler);
  childEventSubscriber('willBlur', childWillBlurHandler);
  childEventSubscriber('didBlur', childDidBlurHandler);
  emitGrandParentAction({
    type: 'action',
    state: transitionState,
    lastState: blurredState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(0);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(0);
  emitGrandParentAction({
    type: 'action',
    state: focusState,
    lastState: transitionState,
    action: { type: 'FooAction' },
  });
  expect(childActionHandler.mock.calls.length).toBe(0);
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
  emitGrandParentAction({
    type: 'action',
    state: focusState,
    lastState: focusState,
    action: { type: 'TestAction' },
  });
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
  expect(childActionHandler.mock.calls.length).toBe(1);
  emitGrandParentAction({
    type: 'action',
    state: transition2State,
    lastState: focusState,
    action: { type: 'CauseWillBlurAction' },
  });
  expect(childWillBlurHandler.mock.calls.length).toBe(1);
  expect(childDidBlurHandler.mock.calls.length).toBe(0);
  expect(childActionHandler.mock.calls.length).toBe(1);
  emitGrandParentAction({
    type: 'action',
    state: blurred2State,
    lastState: transition2State,
    action: { type: 'CauseDidBlurAction' },
  });
  expect(childWillBlurHandler.mock.calls.length).toBe(1);
  expect(childDidBlurHandler.mock.calls.length).toBe(1);
  expect(childActionHandler.mock.calls.length).toBe(1);
});

it('child focus with transition', () => {
  const parentSubscriber = jest.fn();
  const emitParentAction = payload => {
    parentSubscriber.mock.calls.forEach(subs => {
      if (subs[0] === payload.type) {
        subs[1](payload);
      }
    });
  };
  const subscriptionRemove = () => {};
  parentSubscriber.mockReturnValueOnce({ remove: subscriptionRemove });
  const childEventSubscriber = getChildEventSubscriber(parentSubscriber, 'key1')
    .addListener;
  const randomAction = { type: 'FooAction' };
  const testState = {
    key: 'foo',
    routeName: 'FooRoute',
    routes: [{ key: 'key0' }, { key: 'key1' }],
    index: 0,
    isTransitioning: false,
  };
  const childWillFocusHandler = jest.fn();
  const childDidFocusHandler = jest.fn();
  const childWillBlurHandler = jest.fn();
  const childDidBlurHandler = jest.fn();
  childEventSubscriber('willFocus', childWillFocusHandler);
  childEventSubscriber('didFocus', childDidFocusHandler);
  childEventSubscriber('willBlur', childWillBlurHandler);
  childEventSubscriber('didBlur', childDidBlurHandler);
  emitParentAction({
    type: 'didFocus',
    action: randomAction,
    lastState: testState,
    state: testState,
  });
  emitParentAction({
    type: 'action',
    action: randomAction,
    lastState: testState,
    state: {
      ...testState,
      index: 1,
      isTransitioning: true,
    },
  });
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  emitParentAction({
    type: 'action',
    action: randomAction,
    lastState: {
      ...testState,
      index: 1,
      isTransitioning: true,
    },
    state: {
      ...testState,
      index: 1,
      isTransitioning: false,
    },
  });
  expect(childDidFocusHandler.mock.calls.length).toBe(1);
  emitParentAction({
    type: 'action',
    action: randomAction,
    lastState: {
      ...testState,
      index: 1,
      isTransitioning: false,
    },
    state: {
      ...testState,
      index: 0,
      isTransitioning: true,
    },
  });
  expect(childWillBlurHandler.mock.calls.length).toBe(1);
  emitParentAction({
    type: 'action',
    action: randomAction,
    lastState: {
      ...testState,
      index: 0,
      isTransitioning: true,
    },
    state: {
      ...testState,
      index: 0,
      isTransitioning: false,
    },
  });
  expect(childDidBlurHandler.mock.calls.length).toBe(1);
});

it('child focus with immediate transition', () => {
  const parentSubscriber = jest.fn();
  const emitParentAction = payload => {
    parentSubscriber.mock.calls.forEach(subs => {
      if (subs[0] === payload.type) {
        subs[1](payload);
      }
    });
  };
  const subscriptionRemove = () => {};
  parentSubscriber.mockReturnValueOnce({ remove: subscriptionRemove });
  const childEventSubscriber = getChildEventSubscriber(parentSubscriber, 'key1')
    .addListener;
  const randomAction = { type: 'FooAction' };
  const testState = {
    key: 'foo',
    routeName: 'FooRoute',
    routes: [{ key: 'key0' }, { key: 'key1' }],
    index: 0,
    isTransitioning: false,
  };
  const childWillFocusHandler = jest.fn();
  const childDidFocusHandler = jest.fn();
  const childWillBlurHandler = jest.fn();
  const childDidBlurHandler = jest.fn();
  childEventSubscriber('willFocus', childWillFocusHandler);
  childEventSubscriber('didFocus', childDidFocusHandler);
  childEventSubscriber('willBlur', childWillBlurHandler);
  childEventSubscriber('didBlur', childDidBlurHandler);
  emitParentAction({
    type: 'didFocus',
    action: randomAction,
    lastState: testState,
    state: testState,
  });
  emitParentAction({
    type: 'action',
    action: randomAction,
    lastState: testState,
    state: {
      ...testState,
      index: 1,
    },
  });
  expect(childWillFocusHandler.mock.calls.length).toBe(1);
  expect(childDidFocusHandler.mock.calls.length).toBe(1);

  emitParentAction({
    type: 'action',
    action: randomAction,
    lastState: {
      ...testState,
      index: 1,
    },
    state: {
      ...testState,
      index: 0,
    },
  });
  expect(childWillBlurHandler.mock.calls.length).toBe(1);
  expect(childDidBlurHandler.mock.calls.length).toBe(1);
});

const setupEventTest = (subscriptionKey, initialLastFocusEvent) => {
  const parentSubscriber = jest.fn();
  const emitEvent = payload => {
    parentSubscriber.mock.calls.forEach(subs => {
      if (subs[0] === payload.type) {
        subs[1](payload);
      }
    });
  };
  const subscriptionRemove = () => {};
  parentSubscriber.mockReturnValueOnce({ remove: subscriptionRemove });
  const evtProvider = getChildEventSubscriber(
    parentSubscriber,
    subscriptionKey,
    initialLastFocusEvent
  );
  const handlers = {};
  evtProvider.addListener('action', (handlers.action = jest.fn()));
  evtProvider.addListener('willFocus', (handlers.willFocus = jest.fn()));
  evtProvider.addListener('didFocus', (handlers.didFocus = jest.fn()));
  evtProvider.addListener('willBlur', (handlers.willBlur = jest.fn()));
  evtProvider.addListener('didBlur', (handlers.didBlur = jest.fn()));
  return { emitEvent, handlers, evtProvider };
};

it('immediate back with uncompleted transition will focus first screen again', () => {
  const { handlers, emitEvent } = setupEventTest('key0', 'didFocus');
  emitEvent({
    type: 'action',
    state: {
      index: 1,
      routes: [{ key: 'key0' }, { key: 'key1' }],
      isTransitioning: true,
    },
    lastState: {
      index: 0,
      routes: [{ key: 'key0' }],
      isTransitioning: false,
    },
    action: { type: 'Any action, does not matter here' },
  });
  expect(handlers.willFocus.mock.calls.length).toBe(0);
  expect(handlers.didFocus.mock.calls.length).toBe(0);
  expect(handlers.willBlur.mock.calls.length).toBe(1);
  expect(handlers.didBlur.mock.calls.length).toBe(0);
  emitEvent({
    type: 'action',
    state: {
      index: 0,
      routes: [{ key: 'key0' }],
      isTransitioning: true,
    },
    lastState: {
      index: 1,
      routes: [{ key: 'key0' }, { key: 'key1' }],
      isTransitioning: true,
    },
    action: { type: 'Any action, does not matter here' },
  });
  expect(handlers.willFocus.mock.calls.length).toBe(1);
  expect(handlers.didFocus.mock.calls.length).toBe(0);
  expect(handlers.willBlur.mock.calls.length).toBe(1);
  expect(handlers.didBlur.mock.calls.length).toBe(0);
  emitEvent({
    type: 'action',
    state: {
      index: 0,
      routes: [{ key: 'key0' }],
      isTransitioning: false,
    },
    lastState: {
      index: 0,
      routes: [{ key: 'key0' }],
      isTransitioning: true,
    },
    action: { type: 'Any action, does not matter here' },
  });
  expect(handlers.willFocus.mock.calls.length).toBe(1);
  expect(handlers.didFocus.mock.calls.length).toBe(1);
  expect(handlers.willBlur.mock.calls.length).toBe(1);
  expect(handlers.didBlur.mock.calls.length).toBe(0);
});
