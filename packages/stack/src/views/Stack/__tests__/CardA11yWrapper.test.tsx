import { expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';
import { Platform, View } from 'react-native';

import { CardA11yWrapper } from '../CardA11yWrapper';

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

const renderCard = ({ focused }: { focused: boolean }) =>
  render(
    <CardA11yWrapper
      focused={focused}
      active={focused}
      animated
      isNextScreenTransparent={false}
      detachCurrentScreen
    >
      <View />
    </CardA11yWrapper>
  ).toJSON();

test("makes an unfocused card's content inert on the web", () => {
  jest.replaceProperty(Platform, 'OS', 'web');

  expect(
    findInertElement(renderCard({ focused: false }))?.props.inert
  ).toBeDefined();
});

test("doesn't make a focused card's content inert on the web", () => {
  jest.replaceProperty(Platform, 'OS', 'web');

  expect(
    findInertElement(renderCard({ focused: true }))?.props.inert
  ).toBeUndefined();
});
