import { afterEach, expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Platform, View } from 'react-native';

import { Inert } from '../Inert';

const findInertElement = (json: any): any => {
  if (json == null || typeof json !== 'object') {
    return undefined;
  }

  if (json.type === 'div') {
    return json;
  }

  return []
    .concat(json.children ?? [])
    .reduce<any>((acc, child) => acc ?? findInertElement(child), undefined);
};

afterEach(() => {
  jest.restoreAllMocks();
});

test('makes the content inert on the web when enabled', () => {
  jest.replaceProperty(Platform, 'OS', 'web');

  const json = render(
    <Inert enabled>
      <View />
    </Inert>
  ).toJSON();

  // A string is used since React 18 skips boolean values for `inert`
  expect(findInertElement(json)?.props.inert).toBe('inert');
});

test("doesn't make the content inert on the web when disabled", () => {
  jest.replaceProperty(Platform, 'OS', 'web');

  const json = render(
    <Inert enabled={false}>
      <View />
    </Inert>
  ).toJSON();

  expect(findInertElement(json)?.props.inert).toBeUndefined();
});

test("doesn't render an additional element on native", () => {
  const json = render(
    <Inert enabled>
      <View />
    </Inert>
  ).toJSON();

  expect(findInertElement(json)).toBeUndefined();
});
