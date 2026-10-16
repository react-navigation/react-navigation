import { expect } from 'e2e';

import { test } from '../fixtures';

test('Navigator Layout', async ({ launch, screen }) => {
  await launch('navigator-layout', 'Article by Gandalf');
  await screen.getByRole('button', 'Navigate to feed').first().tap();
  await expect(screen.getByText('Feed', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Navigate to albums').first().tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();
  await screen.getByText('Feed', { visible: true }).tap();
  await expect(
    screen.getByText('Joke bot', { visible: true }).first()
  ).toBeVisible();
  await screen.getByText('Article by Gandalf', { visible: true }).tap();
  await expect(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  ).toBeVisible();
});
