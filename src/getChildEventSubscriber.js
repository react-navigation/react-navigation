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

  const emit = payload => {
    const subscribers = getChildSubscribers(payload.type);
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

  const upstreamSubscribers = upstreamEvents.map(eventName =>
    addListener(eventName, payload => {
      const { state, lastState, action } = payload;
      const lastFocusKey = lastState && lastState.routes[lastState.index].key;
      const focusKey = state && state.routes[state.index].key;

      const isFocused = focusKey === key;
      const wasFocused = lastFocusKey === key;
      const lastRoute =
        lastState && lastState.routes.find(route => route.key === key);
      const newRoute = state && state.routes.find(route => route.key === key);
      const childPayload = {
        state: newRoute,
        lastState: lastRoute,
        action,
        type: eventName,
      };

      const didNavigate =
        (lastState && lastState.isTransitioning) !==
        (state && state.isTransitioning);

      const isTransitioning = !!state && state.isTransitioning;
      const wasTransitioning = !!lastState && lastState.isTransitioning;
      const didStartTransitioning = !wasTransitioning && isTransitioning;
      const didFinishTransitioning = wasTransitioning && !isTransitioning;

      if (eventName !== 'action') {
        switch (eventName) {
          case 'didFocus':
            isSelfFocused = true;
            break;
          case 'didBlur':
            isSelfFocused = false;
            break;
        }
        emit(childPayload);
        return;
      }

      // now we're exclusively handling the "action" event

      if (newRoute) {
        // fire this event to pass navigation events to children subscribers
        emit(childPayload);
      }
      if (isFocused && didStartTransitioning && !isSelfFocused) {
        emit({
          ...childPayload,
          type: 'willFocus',
        });
      }
      if (isFocused && didFinishTransitioning && !isSelfFocused) {
        emit({
          ...childPayload,
          type: 'didFocus',
        });
        isSelfFocused = true;
      }
      if (!isFocused && didStartTransitioning && isSelfFocused) {
        emit({
          ...childPayload,
          type: 'willBlur',
        });
      }
      if (!isFocused && didFinishTransitioning && isSelfFocused) {
        emit({
          ...childPayload,
          type: 'didBlur',
        });
        isSelfFocused = false;
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
