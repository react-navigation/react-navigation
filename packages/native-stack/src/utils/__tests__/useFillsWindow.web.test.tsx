import { expect, test } from '@jest/globals';
import { renderHook } from '@testing-library/react';

import { useFillsWindow } from '../useFillsWindow';

const setBodySize = (width: number, height: number) => {
  Object.defineProperty(document.body, 'clientWidth', {
    configurable: true,
    value: width,
  });
  Object.defineProperty(document.body, 'clientHeight', {
    configurable: true,
    value: height,
  });
};

test('reports fill when enabled and its layout matches document.body', () => {
  setBodySize(400, 800);

  const { result } = renderHook(() =>
    useFillsWindow({ enabled: true, layout: { width: 400, height: 800 } })
  );

  expect(result.current).toBe(true);
});

test('does not report fill when disabled', () => {
  setBodySize(400, 800);

  const { result } = renderHook(() =>
    useFillsWindow({ enabled: false, layout: { width: 400, height: 800 } })
  );

  expect(result.current).toBe(false);
});

test('does not report fill when its layout does not match document.body', () => {
  setBodySize(400, 800);

  const { result } = renderHook(() =>
    useFillsWindow({ enabled: true, layout: { width: 320, height: 600 } })
  );

  expect(result.current).toBe(false);
});

test('tolerates a sub-pixel difference between document.body and layout', () => {
  setBodySize(400, 800);

  const { result } = renderHook(() =>
    useFillsWindow({
      enabled: true,
      layout: { width: 400.4, height: 799.6 },
    })
  );

  expect(result.current).toBe(true);
});
