import { expect, jest, test } from '@jest/globals';
import { NavigationContainer } from '@react-navigation/native';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlatformPressable } from '../PlatformPressable';

test('triggers press and prevents navigation on left click', async () => {
  const user = userEvent.setup();

  const onPress = jest.fn();

  render(
    <NavigationContainer>
      <PlatformPressable onPress={onPress} href="/">
        <span>Pressable</span>
      </PlatformPressable>
    </NavigationContainer>
  );

  await user.click(screen.getByRole('link', { name: 'Pressable' }));

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onPress.mock.lastCall?.[0]).toHaveProperty('defaultPrevented', true);
});

test('ignores non-left clicks', async () => {
  const user = userEvent.setup();

  const onPress = jest.fn();

  render(
    <NavigationContainer>
      <PlatformPressable onPress={onPress} href="/">
        <span>Pressable</span>
      </PlatformPressable>
    </NavigationContainer>
  );

  await user.pointer({
    target: screen.getByRole('link', { name: 'Pressable' }),
    keys: '[MouseMiddle]',
  });

  expect(onPress).not.toHaveBeenCalled();
});

test('ignores clicks with a modifier key', async () => {
  const user = userEvent.setup();

  const onPress = jest.fn();

  render(
    <NavigationContainer>
      <PlatformPressable onPress={onPress} href="/">
        <span>Pressable</span>
      </PlatformPressable>
    </NavigationContainer>
  );

  await user.keyboard('{Meta>}');
  await user.click(screen.getByRole('link', { name: 'Pressable' }));

  expect(onPress).not.toHaveBeenCalled();
});
