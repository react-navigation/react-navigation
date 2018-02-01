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
        subs(payload);
      });
  };

  let isParentFocused = true;
  let isChildFocused = false;
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

      const isFocused = focusKey === key;
      const wasFocused = lastFocusKey === key;
      const lastRoute =
        lastRoutes && lastRoutes.find(route => route.key === key);
      const newRoute = routes && routes.find(route => route.key === key);
      const eventContext = payload.context || 'Root';
      const childPayload = {
        context: `${key}:${action.type}_${eventContext}`,
        state: newRoute,
        lastState: lastRoute,
        action,
        type: eventName,
      };

      const isTransitioning = !!state && state.isTransitioning;
      const wasTransitioning = !!lastState && lastState.isTransitioning;
      const didStartTransitioning = !wasTransitioning && isTransitioning;
      const didFinishTransitioning = wasTransitioning && !isTransitioning;
      const wasChildFocused = isChildFocused;
      if (eventName !== 'action') {
        switch (eventName) {
          case 'didFocus':
            isParentFocused = true;
            break;
          case 'didBlur':
            isParentFocused = false;
            break;
        }
        if (isFocused && eventName === 'willFocus') {
          emit(childPayload);
        }
        if (isFocused && !isTransitioning && eventName === 'didFocus') {
          emit(childPayload);
          isChildFocused = true;
        }
        if (isFocused && eventName === 'willBlur') {
          emit(childPayload);
        }
        if (isFocused && !isTransitioning && eventName === 'didBlur') {
          emit(childPayload);
        }
        return;
      }

      // now we're exclusively handling the "action" event
      if (!isParentFocused) {
        return;
      }

      if (isChildFocused && newRoute) {
        // fire this action event to pass navigation events to children subscribers
        emit(childPayload);
      }
      if (isFocused && didStartTransitioning && !isChildFocused) {
        emit({
          ...childPayload,
          type: 'willFocus',
        });
      }
      if (isFocused && didFinishTransitioning && !isChildFocused) {
        emit({
          ...childPayload,
          type: 'didFocus',
        });
        isChildFocused = true;
      }
      if (isFocused && !isChildFocused && !didStartTransitioning) {
        emit({
          ...childPayload,
          type: 'willFocus',
        });
        emit({
          ...childPayload,
          type: 'didFocus',
        });
        isChildFocused = true;
      }
      if (!isFocused && didStartTransitioning && isChildFocused) {
        emit({
          ...childPayload,
          type: 'willBlur',
        });
      }
      if (!isFocused && didFinishTransitioning && isChildFocused) {
        emit({
          ...childPayload,
          type: 'didBlur',
        });
        isChildFocused = false;
      }
      if (!isFocused && isChildFocused && !didStartTransitioning) {
        emit({
          ...childPayload,
          type: 'willBlur',
        });
        emit({
          ...childPayload,
          type: 'didBlur',
        });
        isChildFocused = false;
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
