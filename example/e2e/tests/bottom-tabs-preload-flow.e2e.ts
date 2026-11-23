import { expect } from 'e2e';

import { test } from '../fixtures';

test('Bottom Tabs - Preload Flow', async ({ launch, screen }) => {
  await launch('bottom-tabs-preload-flow', 'Bottom Tabs Preload Flow');
  await expect(
    screen.getByText('Details is not preloaded yet.', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Preload Details').first().tap();
  await expect(
    screen.getByText('Details is preloaded!', { visible: true })
  ).toBeVisible({ timeout: 10000 });
  await screen.getByRole('button', 'Navigate to Details').first().tap();
  await expect(screen.getByText('Loaded!', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Back to home').first().tap();
  await expect(screen.getByRole('button', 'Preload Details')).toBeVisible();
  await screen.getByRole('button', 'Navigate to Details').first().tap();
  await expect(screen.getByText('Loaded!', { visible: true })).toBeVisible();
});
