import {
  afterAll,
  beforeAll,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import { fireEvent, render, userEvent } from '@testing-library/react-native';
import { Platform, View } from 'react-native';

import { PlatformPressable } from '../PlatformPressable';

describe('on native', () => {
  test('should be pressable using simply fireEvent.press', () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PlatformPressable onPress={onPress} testID={'Pressable'}>
        <View />
      </PlatformPressable>
    );

    fireEvent.press(getByTestId('Pressable'));

    expect(onPress).toHaveBeenCalled();
  });

  test('should be pressable using with UserEvent', async () => {
    const onPress = jest.fn();
    const { getByTestId } = render(
      <PlatformPressable onPress={onPress} testID={'Pressable'}>
        <View />
      </PlatformPressable>
    );

    const user = userEvent.setup();
    await user.press(getByTestId('Pressable'));

    expect(onPress).toHaveBeenCalled();
  });
});

describe('on web', () => {
  let originalPlatformOS: typeof Platform.OS;

  beforeAll(() => {
    originalPlatformOS = Platform.OS;
    Platform.OS = 'web';
  });

  afterAll(() => {
    Platform.OS = originalPlatformOS;
  });

  const renderWebUI = (onPress: jest.Mock) => {
    return render(
      <PlatformPressable onPress={onPress} testID={'Pressable'} href={'/'}>
        <View />
      </PlatformPressable>
    );
  };

  test('should ignore non-left clicks', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWebUI(onPress);

    fireEvent.press(getByTestId('Pressable'), { button: 1 });

    expect(onPress).not.toHaveBeenCalled();
  });

  test('should be pressable with a left click', () => {
    const onPress = jest.fn();
    const { getByTestId } = renderWebUI(onPress);

    fireEvent.press(getByTestId('Pressable'), {
      button: 0,
      preventDefault: jest.fn(),
    });

    expect(onPress).toHaveBeenCalled();
  });
});
