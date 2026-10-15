import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Preload Flow', async ({ launch, screen }) => {
  await launch('stack-preload-flow', 'Stack Preload Flow');
  await expect(
    screen.getByText('Details is not preloaded yet.', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Preload Details').first().tap();
  await expect(
    screen.getByText('Details is preloaded!', { visible: true })
  ).toBeVisible({ timeout: 7000 });
  await screen.getByRole('button', 'Navigate to Details').first().tap();
  await expect(screen.getByText('Loaded!', { visible: true })).toBeVisible();
  await expect(screen.getByText('Preloaded', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Back to home').first().tap();
  await expect(
    screen.getByText('Details is not preloaded yet.', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Navigate to Details').first().tap();
  await expect(screen.getByText('Fresh', { visible: true })).toBeVisible();
});
