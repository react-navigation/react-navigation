import { describe, expect, jest, test } from '@jest/globals';
import { fireEvent, render, userEvent } from '@testing-library/react-native';
import { Platform, View } from 'react-native';

import { PlatformPressable } from '../PlatformPressable';

describe('PlatformPressable', () => {
  const renderUI = (onPress: jest.Mock) => {
    return render(
      <PlatformPressable onPress={onPress} testID={'Pressable'}>
        <View />
      </PlatformPressable>
    );
  };

  describe('tests using Fire Event API', () => {
    test('should be pressable using simply fireEvent.press', async () => {
      const onPress = jest.fn();
      const { getByTestId } = renderUI(onPress);

      fireEvent.press(getByTestId('Pressable'));

      expect(onPress).toHaveBeenCalled();
    });
  });

  describe('tests using User Event API', () => {
    jest.useFakeTimers();

    test('should be pressable on web', async () => {
      Platform.OS = 'web';
      const onPress = jest.fn();
      const { getByTestId } = renderUI(onPress);

      const user = userEvent.setup();
      await user.press(getByTestId('Pressable'));

      expect(onPress).toHaveBeenCalled();
    });

    test('should be pressable using the User Event API', async () => {
      const onPress = jest.fn();
      const { getByTestId } = renderUI(onPress);

      const user = userEvent.setup();
      await user.press(getByTestId('Pressable'));

      expect(onPress).toHaveBeenCalled();
    });
  });
});
