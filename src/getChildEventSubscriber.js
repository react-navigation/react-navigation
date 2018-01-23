/**
 * @flow
 */

import type {
  NavigationEventSubscriber,
  NavigationAction,
  NavigationState,
  NavigationEventPayload,
} from './TypeDefinition';

/*
 * This is used to extract one children's worth of events from a stream of navigation action events
 *
 * Based on the 'action' events that get fired for this navigation state, this utility will fire
 * focus and blur events for this child
 */
export default function getChildEventSubscriber(
  addListener: NavigationEventSubscriber,
  key: string
): NavigationEventSubscriber {
  const actionSubscribers = new Set();
  const willFocusSubscribers = new Set();
  const didFocusSubscribers = new Set();
  const willBlurSubscribers = new Set();
  const didBlurSubscribers = new Set();

  const getChildSubscribers = evtName => {
    switch (evtName) {
      case 'action':
        return actionSubscribers;
      case 'willFocus':
        return willFocusSubscribers;
      case 'didFocus':
        return didFocusSubscribers;
      case 'willBlur':
        return willBlurSubscribers;
      case 'didBlur':
        return didBlurSubscribers;
      default:
        return null;
    }
  };

  const emit = (eventName, payload) => {
    const subscribers = getChildSubscribers(eventName);
    subscribers &&
      subscribers.forEach(subs => {
        // $FlowFixMe - Payload should probably understand generic state type
        subs(payload);
      });
  };

  let isSelfFocused = false;

  const cleanup = () => {
    upstreamSubscribers.forEach(subs => subs && subs.remove());
  };

  const upstreamEvents = [
    'willFocus',
    'didFocus',
    'willBlur',
    'didBlur',
    'action',
  ];

  const upstreamSubscribers = upstreamEvents.map(eventName => {
    addListener(eventName, (payload: NavigationEventPayload) => {
      const { state, lastState, action } = payload;
      const lastFocusKey = lastState && lastState.routes[lastState.index].key;
      const focusKey = state && state.routes[state.index].key;

      const isFocused = focusKey === key;
      const wasFocused = lastFocusKey === key;
      const lastRoute =
        lastState && lastState.routes.find(route => route.key === key);
      const newRoute = state && state.routes.find(route => route.key === key);
      const childPayload = { state: newRoute, lastState: lastRoute, action };

      const didNavigate =
        (lastState && lastState.isNavigating) !== (state && state.isNavigating);

      const isNavigating = !!state && state.isNavigating;
      const wasNavigating = !!lastState && lastState.isNavigating;
      const didStartNavigating = !wasNavigating && isNavigating;
      const didFinishNavigating = wasNavigating && !isNavigating;

      if (eventName !== 'action') {
        switch (eventName) {
          case 'didFocus':
            isSelfFocused = true;
            break;
          case 'didBlur':
            isSelfFocused = false;
            break;
        }
        emit(eventName, childPayload);
        return;
      }

      // now we're exclusively handling the "action" event

      if (newRoute) {
        // fire this event to pass navigation events to children subscribers
        emit('action', childPayload);
      }
      if (isFocused && didStartNavigating && !isSelfFocused) {
        emit('willFocus', childPayload);
      }
      if (isFocused && didFinishNavigating && !isSelfFocused) {
        emit('didFocus', childPayload);
        isSelfFocused = true;
      }
      if (!isFocused && didStartNavigating && isSelfFocused) {
        emit('willBlur', childPayload);
      }
      if (!isFocused && didFinishNavigating && isSelfFocused) {
        emit('didBlur', childPayload);
        isSelfFocused = false;
      }
    });
  });

  return (eventName, eventHandler) => {
    const subscribers = getChildSubscribers(eventName);
    if (!subscribers) {
      throw new Error(`Invalid event name "${eventName}"`);
    }
    subscribers.add(eventHandler);
    const remove = () => {
      subscribers.delete(eventHandler);
    };
    return { remove };
  };
}
