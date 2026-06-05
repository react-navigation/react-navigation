import {
  afterEach,
  beforeEach,
  describe,
  expect,
  jest,
  test,
} from '@jest/globals';
import {
  act,
  fireEvent,
  render,
  screen,
  userEvent,
} from '@testing-library/react-native';
import { Platform, View } from 'react-native';

import { PlatformPressable } from '../PlatformPressable';

jest.useFakeTimers();

test('triggers onPress on press event', async () => {
  const onPress = jest.fn();
  const user = userEvent.setup();

  await render(
    <PlatformPressable onPress={onPress} testID="pressable">
      <View />
    </PlatformPressable>
  );

  await user.press(screen.getByTestId('pressable'));

  await act(() => jest.runAllTimers());

  expect(onPress).toHaveBeenCalled();
});

describe('web', () => {
  beforeEach(() => {
    jest.replaceProperty(Platform, 'OS', 'web');
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  test('triggers press on left click', async () => {
    const onPress = jest.fn();
    const preventDefault = jest.fn();

    await render(
      <PlatformPressable onPress={onPress} testID="pressable" href={'/'}>
        <View />
      </PlatformPressable>
    );

    await fireEvent.press(screen.getByTestId('pressable'), {
      button: 0,
      preventDefault,
    });

    await act(() => jest.runAllTimers());

    expect(preventDefault).toHaveBeenCalled();
    expect(onPress).toHaveBeenCalled();
  });

  test('ignores press non-left clicks', async () => {
    const onPress = jest.fn();

    await render(
      <PlatformPressable onPress={onPress} testID="pressable" href={'/'}>
        <View />
      </PlatformPressable>
    );

    await fireEvent.press(screen.getByTestId('pressable'), { button: 1 });

    await act(() => jest.runAllTimers());

    expect(onPress).not.toHaveBeenCalled();
  });
});
