import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Float + Screen Header', async ({ launch, screen }) => {
  await launch('stack-float-screen-header', 'Article by Gandalf');
  await screen.getByRole('button', 'Push feed').first().tap();
  await expect(screen.getByText('Feed', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Navigate to albums').first().tap();
  await expect(screen.getByText('Albums', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Pop screen').first().tap();
  await expect(screen.getByText('Feed', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Pop screen').first().tap();
  await expect(
    screen.getByText('Article by Gandalf', { visible: true })
  ).toBeVisible();
});
