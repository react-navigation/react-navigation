import { expect } from 'e2e';

import { test } from '../fixtures';

test('Libraries - Drawer Layout', async ({ launch, screen }) => {
  await launch('drawer-view', 'Drawer Layout');
  await expect(
    screen.getByText('Open drawer', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Open drawer').first().tap();
  await expect(screen.getByText('Close', { visible: true })).toBeVisible({
    timeout: 2000,
  });
  await screen.getByRole('button', 'Close').first().tap();
  await expect(screen.getByText('Open drawer', { visible: true })).toBeVisible({
    timeout: 2000,
  });
  await screen.getByRole('button', 'Change position (left)').first().tap();
  await expect(
    screen.getByText('Change position (right)', { visible: true })
  ).toBeVisible();
});
