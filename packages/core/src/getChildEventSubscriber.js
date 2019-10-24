/*
 * This is used to extract one children's worth of events from a stream of navigation action events
 *
 * Based on the 'action' events that get fired for this navigation state, this utility will fire
 * focus and blur events for this child
 */
export default function getChildEventSubscriber(
  addListener,
  key,
  initialLastFocusEvent = 'didBlur'
) {
  const actionSubscribers = new Set();
  const willFocusSubscribers = new Set();
  const didFocusSubscribers = new Set();
  const willBlurSubscribers = new Set();
  const didBlurSubscribers = new Set();
  const refocusSubscribers = new Set();

  const removeAll = () => {
    [
      actionSubscribers,
      willFocusSubscribers,
      didFocusSubscribers,
      willBlurSubscribers,
      didBlurSubscribers,
      refocusSubscribers,
    ].forEach(set => set.clear());

    upstreamSubscribers.forEach(subs => subs && subs.remove());
  };

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
      case 'refocus':
        return refocusSubscribers;
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

  // lastFocusEvent keeps track of focus state for one route. First we assume
  // we are blurred. If we are focused on initialization, the first 'action'
  // event will cause onFocus+willFocus events because we had previously been
  // considered blurred
  let lastFocusEvent = initialLastFocusEvent;

  const upstreamEvents = [
    'willFocus',
    'didFocus',
    'willBlur',
    'didBlur',
    'refocus',
    'action',
  ];

  const upstreamSubscribers = upstreamEvents.map(eventName =>
    addListener(eventName, payload => {
      if (eventName === 'refocus') {
        emit(eventName, payload);
        return;
      }

      const { state, lastState, action } = payload;
      const lastRoutes = lastState && lastState.routes;
      const routes = state && state.routes;

      // const lastFocusKey =
      //   lastState && lastState.routes && lastState.routes[lastState.index].key;
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

      const previouslylastFocusEvent = lastFocusEvent;

      if (lastFocusEvent === 'didBlur') {
        // The child is currently blurred. Look for willFocus conditions
        if (eventName === 'willFocus' && isChildFocused) {
          emit((lastFocusEvent = 'willFocus'), childPayload);
        } else if (eventName === 'action' && isChildFocused) {
          emit((lastFocusEvent = 'willFocus'), childPayload);
        }
      }
      if (lastFocusEvent === 'willFocus') {
        // We are currently mid-focus. Look for didFocus conditions.
        // If state.isTransitioning is false, this child event happens immediately after willFocus
        if (eventName === 'didFocus' && isChildFocused && !isTransitioning) {
          emit((lastFocusEvent = 'didFocus'), childPayload);
        } else if (
          eventName === 'action' &&
          isChildFocused &&
          !isTransitioning
        ) {
          emit((lastFocusEvent = 'didFocus'), childPayload);
        }
      }

      if (lastFocusEvent === 'didFocus') {
        // The child is currently focused. Look for blurring events
        if (!isChildFocused) {
          // The child is no longer focused within this navigation state
          emit((lastFocusEvent = 'willBlur'), childPayload);
        } else if (eventName === 'willBlur') {
          // The parent is getting a willBlur event
          emit((lastFocusEvent = 'willBlur'), childPayload);
        } else if (
          eventName === 'action' &&
          previouslylastFocusEvent === 'didFocus'
        ) {
          // While focused, pass action events to children for grandchildren focus
          emit('action', childPayload);
        }
      }

      if (lastFocusEvent === 'willBlur') {
        // The child is mid-blur. Wait for transition to end
        if (eventName === 'action' && !isChildFocused && !isTransitioning) {
          // The child is done blurring because transitioning is over, or isTransitioning
          // never began and didBlur fires immediately after willBlur
          emit((lastFocusEvent = 'didBlur'), childPayload);
        } else if (eventName === 'didBlur') {
          // Pass through the parent didBlur event if it happens
          emit((lastFocusEvent = 'didBlur'), childPayload);
        } else if (
          eventName === 'action' &&
          isChildFocused &&
          !isTransitioning
        ) {
          emit((lastFocusEvent = 'didFocus'), childPayload);
        } else if (
          eventName === 'action' &&
          isChildFocused &&
          isTransitioning
        ) {
          emit((lastFocusEvent = 'willFocus'), childPayload);
        }
      }

      if (lastFocusEvent === 'didBlur' && !newRoute) {
        removeAll();
      }
    })
  );

  return {
    addListener(eventName, eventHandler) {
      const subscribers = getChildSubscribers(eventName);
      if (!subscribers) {
        throw new Error(`Invalid event name "${eventName}"`);
      }
      subscribers.add(eventHandler);
      const remove = () => {
        subscribers.delete(eventHandler);
      };
      return { remove };
    },
    emit(eventName, payload) {
      if (eventName !== 'refocus') {
        console.error(
          `navigation.emit only supports the 'refocus' event currently.`
        );
        return;
      }
      emit(eventName, payload);
    },
  };
}
