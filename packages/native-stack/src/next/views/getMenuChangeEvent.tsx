import type { NativeStackHeaderMenuChangeEvent } from '../../types';

export function getMenuChangeEvent(
  toggleItemIds: string[],
  selectedItemIds: string[]
): NativeStackHeaderMenuChangeEvent {
  return {
    checked: Object.fromEntries(
      toggleItemIds.map((itemId) => [itemId, selectedItemIds.includes(itemId)])
    ),
  };
}
