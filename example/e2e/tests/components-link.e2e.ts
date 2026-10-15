import { expect } from 'e2e';

import { test } from '../fixtures';

test('Components - Link', async ({ launch, screen }) => {
  await launch('components-link', 'Article by Gandalf');

  await screen.getByText('Go to albums', { visible: true }).tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();

  // There's both a link and a button with the same text
  await screen.getByText('Go to Article', { visible: true }).first().tap();
  await expect(
    screen.getByText('Article by Babel', { visible: true })
  ).toBeVisible();

  await screen.getByRole('button', 'Replace params').first().tap();
  await expect(
    screen.getByText('Article by Gandalf', { visible: true })
  ).toBeVisible();

  await screen.getByRole('button', 'Push params').first().tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();

  await screen.getByText('Go back', { visible: true }).first().tap();
  await expect(
    screen.getByText('Article by Gandalf', { visible: true })
  ).toBeVisible();

  await screen.getByText('Replace with albums', { visible: true }).tap();
  await expect(
    screen.getByTestId('album-0', { visible: true }).first()
  ).toBeVisible();
});
