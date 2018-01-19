/**
 * @flow
 */

import type { EventSubscriber } from './TypeDefinition';

/*
 * This is used to extract one children's worth of events from a stream of navigation action events
 *
 * Based on the 'action' events that get fired for this navigation state, this utility will fire
 * focus and blur events for this child
 */
export default function getChildEventSubscriber(
  addListener: EventSubscriber,
  key: string
): EventSubscriber {
  return (eventName, eventHandler) => {
    let isFocused = false;
    let isFocusNavigating = false;
    return addListener('action', payload => {
      // $FlowFixMe ack
      const { state, lastState, action } = payload;

      // At this point, we know the listener is subscribed to the `eventName` event of the `key`
      // child route. And an action has just happened on the parent navigation state. The previous
      // navigation state was `lastState` and after the `action` it is now `state`.

      const wasFocused = isFocused;
      isFocused = state.routes[state.index].key === key;
      const lastRoute =
        lastState && lastState.routes.find(route => route.key === key);
      const newRoute = state.routes.find(route => route.key === key);

      // Fires an event to the handler if the event name is correct
      const dispatchForEventName = evtName => {
        if (evtName === eventName) {
          eventHandler({ state: newRoute, lastState: lastRoute, action });
        }
      };
      const isNavigating = state.isNavigating;
      const wasNavigating = !!lastState && lastState.isNavigating;

      if (newRoute && lastRoute !== newRoute) {
        // route has changed. fire this event to pass navigation events to further children event
        // subscribers
        dispatchForEventName('action');
      }

      if (wasFocused) {
        if (isFocused) {
          // check for completion of focus navigation
          if (!isNavigating && wasNavigating && isFocusNavigating) {
            dispatchForEventName('didFocus');
            isFocusNavigating = false;
          }
        } else {
          // blur now starting
          dispatchForEventName('willBlur');

          if (isNavigating) {
            isFocusNavigating = true;
          } else if (isFocusNavigating) {
            dispatchForEventName('didBlur');
          }
        }
      } else {
        // was not focused

        if (isFocused) {
          // now focusing!
          dispatchForEventName('willFocus');

          if (isNavigating) {
            isFocusNavigating = true;
          } else if (isFocusNavigating) {
            dispatchForEventName('didFocus');
          }
        } else {
          // check for completion of blur navigation
          if (!isNavigating && wasNavigating && isFocusNavigating) {
            dispatchForEventName('didBlur');
            isFocusNavigating = false;
          }
        }
      }
    });
  };
}
