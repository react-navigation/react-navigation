import { afterEach, beforeEach, expect, test } from '@jest/globals';
import { renderHook } from '@testing-library/react';

import { useFillsWindow } from '../useFillsWindow';

const STYLE_ID = '__react-navigation-native-stack-mobile-chrome-viewport-fix';

const ANDROID_CHROME_UA =
  'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Mobile Safari/537.36';

const IPHONE_SAFARI_UA =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1';

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

const setUserAgent = (ua: string) => {
  Object.defineProperty(navigator, 'userAgent', {
    configurable: true,
    value: ua,
  });
};

let originalUserAgent: string;

beforeEach(() => {
  originalUserAgent = navigator.userAgent;
});

afterEach(() => {
  setUserAgent(originalUserAgent);
  document.getElementById(STYLE_ID)?.remove();
});

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

test('adds the mobile Chrome viewport-fix style tag only on Android Chrome', () => {
  setUserAgent(ANDROID_CHROME_UA);
  setBodySize(400, 800);

  renderHook(() =>
    useFillsWindow({ enabled: true, layout: { width: 400, height: 800 } })
  );

  expect(document.getElementById(STYLE_ID)).not.toBeNull();
});

test('does not add the viewport-fix style tag on iPhone Safari', () => {
  setUserAgent(IPHONE_SAFARI_UA);
  setBodySize(400, 800);

  renderHook(() =>
    useFillsWindow({ enabled: true, layout: { width: 400, height: 800 } })
  );

  expect(document.getElementById(STYLE_ID)).toBeNull();
});
