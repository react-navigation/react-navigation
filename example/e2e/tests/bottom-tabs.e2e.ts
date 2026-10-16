import { expect } from 'e2e';

import { expectScrolledOutOfView, test } from '../fixtures';

test('Bottom Tabs - Basic', async ({ launch, screen, scroll }) => {
  await launch('bottom-tabs', 'Article by Gandalf');
  await screen.getByRole('button', 'Navigate to feed').first().tap();
  await expect(screen.getByText('Feed', { visible: true })).toBeVisible();
  await screen.getByTestId('albums').tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Go to Chat').first().tap();
  await expect(
    screen.getByText('make me a sandwich', { visible: true })
  ).toBeVisible();
  await screen.getByTestId('contacts').tap();
  await expect(
    screen.getByText('Marissa Castillo', { visible: true })
  ).toBeVisible();
  await scroll();
  await expectScrolledOutOfView(
    screen.getByText('Marissa Castillo', { visible: true })
  );
  await screen.getByTestId('contacts').tap();
  await expect(
    screen.getByText('Marissa Castillo', { visible: true })
  ).toBeVisible({ timeout: 5000 });
  await screen.getByTestId('article').tap();
  await expect(
    screen.getByText('Article by Gandalf', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Navigate to feed').first().tap();
  await expect(screen.getByText('Feed', { visible: true })).toBeVisible();
  await screen.getByTestId('article').tap();
  await expect(
    screen.getByText('Article by Gandalf', { visible: true })
  ).toBeVisible();
});
