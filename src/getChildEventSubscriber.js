/*
 * This is used to extract one children's worth of events from a stream of navigation action events
 *
 * Based on the 'action' events that get fired for this navigation state, this utility will fire
 * focus and blur events for this child
 */

export default function getChildEventSubscriber(addListener, key) {
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

  const emit = (type, payload) => {
    const payloadWithType = { ...payload, type };
    const subscribers = getChildSubscribers(type);
    subscribers &&
      subscribers.forEach(subs => {
        subs(payloadWithType);
      });
  };

  // lastEmittedEvent keeps track of focus state for one route. First we assume
  // we are blurred. If we are focused on initialization, the first 'action'
  // event will cause onFocus+willFocus events because we had previously been
  // considered blurred
  let lastEmittedEvent = 'didBlur';

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

  const upstreamSubscribers = upstreamEvents.map(eventName =>
    addListener(eventName, payload => {
      const { state, lastState, action } = payload;
      const lastRoutes = lastState && lastState.routes;
      const routes = state && state.routes;

      const lastFocusKey =
        lastState && lastState.routes && lastState.routes[lastState.index].key;
      const focusKey = routes && routes[state.index].key;

      const isChildFocused = focusKey === key;
      const lastRoute =
        lastRoutes && lastRoutes.find(route => route.key === key);
      const newRoute = routes && routes.find(route => route.key === key);
      const childPayload = {
        context: `${key}:${action.type}_${payload.context || 'Root'}`,
        state: newRoute,
        lastState: lastRoute,
        action,
        type: eventName,
      };
      const isTransitioning = !!state && state.isTransitioning;

      const previouslyLastEmittedEvent = lastEmittedEvent;

      if (lastEmittedEvent === 'didBlur') {
        // The child is currently blurred. Look for willFocus conditions
        if (eventName === 'willFocus' && isChildFocused) {
          emit((lastEmittedEvent = 'willFocus'), childPayload);
        } else if (eventName === 'action' && isChildFocused) {
          emit((lastEmittedEvent = 'willFocus'), childPayload);
        }
      }
      if (lastEmittedEvent === 'willFocus') {
        // We are currently mid-focus. Look for didFocus conditions.
        // If state.isTransitioning is false, this child event happens immediately after willFocus
        if (eventName === 'didFocus' && isChildFocused && !isTransitioning) {
          emit((lastEmittedEvent = 'didFocus'), childPayload);
        } else if (
          eventName === 'action' &&
          isChildFocused &&
          !isTransitioning
        ) {
          emit((lastEmittedEvent = 'didFocus'), childPayload);
        }
      }

      if (lastEmittedEvent === 'didFocus') {
        // The child is currently focused. Look for blurring events
        if (!isChildFocused) {
          // The child is no longer focused within this navigation state
          emit((lastEmittedEvent = 'willBlur'), childPayload);
        } else if (eventName === 'willBlur') {
          // The parent is getting a willBlur event
          emit((lastEmittedEvent = 'willBlur'), childPayload);
        } else if (
          eventName === 'action' &&
          previouslyLastEmittedEvent === 'didFocus'
        ) {
          // While focused, pass action events to children for grandchildren focus
          emit('action', childPayload);
        }
      }

      if (lastEmittedEvent === 'willBlur') {
        // The child is mid-blur. Wait for transition to end
        if (eventName === 'action' && !isChildFocused && !isTransitioning) {
          // The child is done blurring because transitioning is over, or isTransitioning
          // never began and didBlur fires immediately after willBlur
          emit((lastEmittedEvent = 'didBlur'), childPayload);
        } else if (eventName === 'didBlur') {
          // Pass through the parent didBlur event if it happens
          emit((lastEmittedEvent = 'didBlur'), childPayload);
        }
      }
    })
  );

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
