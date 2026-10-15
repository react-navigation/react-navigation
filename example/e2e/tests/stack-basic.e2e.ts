import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Basic', async ({ launch, screen }) => {
  await launch('stack-basic', 'Article by Gandalf');
  await screen.getByRole('button', 'Update params').first().tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Navigate to feed').first().tap();
  await expect(screen.getByText('Feed', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Replace with contacts').first().tap();
  await expect(screen.getByText('Contacts', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Push albums').first().tap();
  await expect(screen.getByText('Albums', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Push article').first().tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Pop to albums').first().tap();
  await expect(screen.getByText('Albums', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Pop by 2').first().tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();
});
