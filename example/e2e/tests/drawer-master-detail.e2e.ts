import { expect } from 'e2e';

import { test } from '../fixtures';

test('Drawer - Master Detail', async ({ launch, screen }) => {
  // The screen slides away to reveal the drawer behind it, starting from the left
  // So tap the start of the item to avoid tapping it while it's still covered
  const tapDrawerItem = async (name: string) => {
    await screen
      .getByRole('button', name)
      .first()
      .tap({ position: { x: 16, y: 16 } });
  };

  await launch('drawer-master-detail', 'Pages');

  await tapDrawerItem('Feed');
  await expect(
    screen.getByText('Joke bot', { visible: true }).first()
  ).toBeVisible();

  await screen.getByRole('button', 'Go back').first().tap();
  await tapDrawerItem('Albums');
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();
  await expect(screen.getByText('Joke bot', { visible: true })).toBeHidden();

  await screen.getByRole('button', 'Go back').first().tap();
  await tapDrawerItem('Article');
  await expect(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  ).toBeVisible();
});
