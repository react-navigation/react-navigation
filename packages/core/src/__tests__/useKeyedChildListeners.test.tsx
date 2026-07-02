import { expect, test } from '@jest/globals';
import { renderHook } from '@testing-library/react-native';

import { useKeyedChildListeners } from '../useKeyedChildListeners';

test("cleanup of a replaced listener doesn't remove the newer one", () => {
  const { result } = renderHook(() => useKeyedChildListeners());

  const first = () => false;
  const second = () => false;

  const removeFirst = result.current.addKeyedListener(
    'beforeRemove',
    'test',
    first
  );

  const removeSecond = result.current.addKeyedListener(
    'beforeRemove',
    'test',
    second
  );

  removeFirst();

  expect(result.current.keyedListeners.beforeRemove.test).toBe(second);

  removeSecond();

  expect(result.current.keyedListeners.beforeRemove.test).toBeUndefined();
});
