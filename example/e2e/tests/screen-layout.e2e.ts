import { expect } from 'e2e';

import { test } from '../fixtures';

test('Screen Layout', async ({ launch, screen, dismissErrorOverlay }) => {
  await launch('screen-layout', 'Loading…');
  await expect(screen.getByText('Suspend', { visible: true })).toBeVisible({
    timeout: 3500,
  });
  await screen.getByRole('button', 'Crash').first().tap();
  await dismissErrorOverlay();
  await expect(
    screen.getByText('Something went wrong', { visible: true })
  ).toBeVisible();
  await expect(screen.getByText('Crash', { visible: true })).toBeHidden();
  await screen.getByRole('button', 'Try again').first().tap();
  await expect(screen.getByText('Crash', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Suspend').first().tap();
  await expect(screen.getByText('Loading…', { visible: true })).toBeVisible();
  await expect(screen.getByText('Suspend', { visible: true })).toBeHidden();
  await expect(screen.getByText('Suspend', { visible: true })).toBeVisible({
    timeout: 5000,
  });
});
