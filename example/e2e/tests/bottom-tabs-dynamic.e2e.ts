import { expect } from 'e2e';

import { test } from '../fixtures';

test('Bottom Tabs - Dynamic', async ({ launch, screen }) => {
  await launch('bottom-tabs-dynamic', 'Tab 0');
  await screen.getByRole('button', 'Add a tab').first().tap();
  await expect(screen.getByTestId('tab-2')).toBeVisible();
  await screen.getByRole('button', 'Add a tab').first().tap();
  await expect(screen.getByTestId('tab-3')).toBeVisible();
  await screen.getByRole('button', 'Add a tab').first().tap();
  await expect(screen.getByTestId('tab-4')).toBeVisible();
  await screen.getByRole('button', 'Remove a tab').first().tap();
  await expect(screen.getByTestId('tab-4')).toBeHidden();
  await screen.getByRole('button', 'Remove a tab').first().tap();
  await expect(screen.getByTestId('tab-3')).toBeHidden();
});
