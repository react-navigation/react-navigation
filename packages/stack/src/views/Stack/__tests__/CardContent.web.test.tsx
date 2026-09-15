import { expect, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import { Text } from 'react-native';

import { CardContent } from '../CardContent';

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
