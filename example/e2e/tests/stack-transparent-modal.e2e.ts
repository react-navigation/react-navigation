import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Transparent Modal', async ({ launch, screen }) => {
  await launch('stack-transparent-modal', 'Article');
  await screen.getByRole('button', 'Show Dialog').first().tap();
  await expect(screen.getByText('Trivia', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Okay').first().tap();
  await expect(screen.getByText('Trivia', { visible: true })).toBeHidden();
  await screen.getByRole('button', 'Push NewsFeed').first().tap();
  await expect(screen.getByText('NewsFeed', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Show Dialog').first().tap();
  await expect(screen.getByText('Trivia', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Okay').first().tap();
  await expect(screen.getByText('Trivia', { visible: true })).toBeHidden();
});
