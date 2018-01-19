/**
 * @flow
 */

import type { EventSubscriber } from './TypeDefinition';

export default function getChildEventSubscriber(
  addListener: EventSubscriber,
  key: string
): EventSubscriber {
  return addListener;
  // return (eventName, eventHandler) => addListener('onAction', payload => {
  //   const {state, lastState, action} = payload;
  //   eventHandler(payload);
  // });
}
