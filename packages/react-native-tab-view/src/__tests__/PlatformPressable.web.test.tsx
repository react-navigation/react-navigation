import { expect, jest, test } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PlatformPressable } from '../PlatformPressable';

test('triggers press and prevents navigation on left click', async () => {
  const user = userEvent.setup();

  const onPress = jest.fn();

  render(
    <PlatformPressable onPress={onPress} href="/">
      <span>Pressable</span>
    </PlatformPressable>
  );

  await user.click(screen.getByRole('link', { name: 'Pressable' }));

  expect(onPress).toHaveBeenCalledTimes(1);
  expect(onPress.mock.lastCall?.[0]).toHaveProperty('defaultPrevented', true);
});

test('ignores non-left clicks', async () => {
  const user = userEvent.setup();

  const onPress = jest.fn();

  render(
    <PlatformPressable onPress={onPress} href="/">
      <span>Pressable</span>
    </PlatformPressable>
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
    <PlatformPressable onPress={onPress} href="/">
      <span>Pressable</span>
    </PlatformPressable>
  );

  await user.keyboard('{Meta>}');
  await user.click(screen.getByRole('link', { name: 'Pressable' }));

  expect(onPress).not.toHaveBeenCalled();
});
