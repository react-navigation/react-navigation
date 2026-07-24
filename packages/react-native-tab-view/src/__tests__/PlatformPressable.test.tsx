import { expect, jest, test } from '@jest/globals';
import { act, render, screen, userEvent } from '@testing-library/react-native';
import { View } from 'react-native';

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
