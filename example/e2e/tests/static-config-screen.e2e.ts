import { expect } from 'e2e';

import { test } from '../fixtures';

test('Static config', async ({ launch, screen }) => {
  await launch('static-config-screen', 'Albums');

  await screen.getByRole('button', 'Show Chat').first().tap();
  await expect(screen.getByTestId('chat')).toBeVisible();

  await screen.getByTestId('chat').tap();
  await expect(
    screen.getByText('make me a sandwich', { visible: true })
  ).toBeVisible();

  await screen.getByTestId('albums').tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();

  await screen.getByRole('button', 'Hide Chat').first().tap();
  await expect(screen.getByTestId('chat')).toBeHidden();
});
