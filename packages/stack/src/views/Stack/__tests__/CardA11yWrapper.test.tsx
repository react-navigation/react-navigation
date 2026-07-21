import { afterEach, describe, expect, jest, test } from '@jest/globals';
import { render } from '@testing-library/react-native';
import * as React from 'react';
import { Platform, View } from 'react-native';

import { CardA11yWrapper } from '../CardA11yWrapper';

const renderCard = ({ focused }: { focused: boolean }) =>
  render(
    <CardA11yWrapper
      focused={focused}
      active={focused}
      animated
      isNextScreenTransparent={false}
      detachCurrentScreen
    >
      <React.Fragment />
    </CardA11yWrapper>
  );

const getCardElement = (root: ReturnType<typeof renderCard>) =>
  root.UNSAFE_getByType(View).instance as unknown as { inert?: boolean };

describe('on web', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  test("sets `inert` on the unfocused card's element so it can't receive keyboard focus", () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    const root = renderCard({ focused: false });

    expect(getCardElement(root).inert).toBe(true);
  });

  test("doesn't set `inert` on the focused card's element", () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    const root = renderCard({ focused: true });

    expect(getCardElement(root).inert).toBe(false);
  });

  test('updates `inert` when focus changes', () => {
    jest.replaceProperty(Platform, 'OS', 'web');

    const root = renderCard({ focused: false });

    root.rerender(
      <CardA11yWrapper
        focused
        active
        animated
        isNextScreenTransparent={false}
        detachCurrentScreen
      >
        <React.Fragment />
      </CardA11yWrapper>
    );

    expect(getCardElement(root).inert).toBe(false);
  });
});

describe('on native', () => {
  test("doesn't set `inert` on the card's element", () => {
    const root = renderCard({ focused: false });

    expect(getCardElement(root).inert).toBeUndefined();
  });
});
