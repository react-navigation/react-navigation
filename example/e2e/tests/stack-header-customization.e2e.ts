import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Header Customization', async ({ launch, screen }) => {
  await launch('stack-header-customization', 'Article by Gandalf');
  await screen.getByRole('button', 'Push feed').first().tap();
  await expect(screen.getByText('Feed', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Push albums').first().tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Navigate to article').first().tap();
  await expect(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Pop screen').first().tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Pop by 2').first().tap();
  await expect(
    screen.getByText('Article by Gandalf', { visible: true })
  ).toBeVisible();
});
