import { afterEach, beforeEach, expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';

import { CardContent } from '../CardContent';

const STYLE_ID = '__react-navigation-stack-mobile-chrome-viewport-fix';

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

test('fills the page when enabled and its layout matches document.body', () => {
  setBodySize(400, 800);

  render(
    <CardContent enabled layout={{ width: 400, height: 800 }} testID="card">
      <Text>Hello</Text>
    </CardContent>
  );

  expect(screen.getByTestId('card').className).toContain('r-minHeight-');
});

test('stays a fixed-size card when disabled', () => {
  setBodySize(400, 800);

  render(
    <CardContent
      enabled={false}
      layout={{ width: 400, height: 800 }}
      testID="card"
    >
      <Text>Hello</Text>
    </CardContent>
  );

  expect(screen.getByTestId('card').className).toContain('r-flex-');
});

test('stays a fixed-size card when its layout does not match document.body', () => {
  setBodySize(400, 800);

  render(
    <CardContent enabled layout={{ width: 320, height: 600 }} testID="card">
      <Text>Hello</Text>
    </CardContent>
  );

  expect(screen.getByTestId('card').className).toContain('r-flex-');
});

test('opts out of filling the page when contentStyle sets flex: 1', () => {
  setBodySize(400, 800);

  render(
    <CardContent
      enabled
      layout={{ width: 400, height: 800 }}
      style={{ flex: 1 }}
      testID="card"
    >
      <Text>Hello</Text>
    </CardContent>
  );

  expect(screen.getByTestId('card').className).not.toContain('r-minHeight-');
});

test('tolerates a sub-pixel difference between document.body and layout', () => {
  setBodySize(400, 800);

  render(
    <CardContent enabled layout={{ width: 400.4, height: 799.6 }} testID="card">
      <Text>Hello</Text>
    </CardContent>
  );

  expect(screen.getByTestId('card').className).toContain('r-minHeight-');
});

test('adds the mobile Chrome viewport-fix style tag only on Android Chrome', () => {
  setUserAgent(ANDROID_CHROME_UA);
  setBodySize(400, 800);

  render(
    <CardContent enabled layout={{ width: 400, height: 800 }} testID="card">
      <Text>Hello</Text>
    </CardContent>
  );

  expect(document.getElementById(STYLE_ID)).not.toBeNull();
});

test('does not add the viewport-fix style tag on iPhone Safari', () => {
  setUserAgent(IPHONE_SAFARI_UA);
  setBodySize(400, 800);

  render(
    <CardContent enabled layout={{ width: 400, height: 800 }} testID="card">
      <Text>Hello</Text>
    </CardContent>
  );

  expect(document.getElementById(STYLE_ID)).toBeNull();
});
