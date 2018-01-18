/**
 * @flow
 */

import type { EventSubscriber } from './TypeDefinition';

export default function getChildEventSubscriber(
  addListener: EventSubscriber,
  key: string
): EventSubscriber {
  return addListener;
}
