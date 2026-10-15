import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Modal', async ({ launch, screen }) => {
  await launch('stack-modal', 'Article by Gandalf');
  await screen.getByRole('button', 'Push albums').first().tap();
  await expect(screen.getByText('Albums', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Push article').first().tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Go back').first().tap();
  await expect(screen.getByText('Albums', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Go back').first().tap();
  await expect(
    screen.getByText('Article by Gandalf', { visible: true })
  ).toBeVisible();
});
