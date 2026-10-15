import { expect } from 'e2e';

import { test } from '../fixtures';

test('Showcase - Drawer', async ({ launch, screen }) => {
  await launch('drawer-showcase', 'Total Balance');
  await screen.getByTestId('showcase-drawer-toggle', { visible: true }).tap();
  await screen.getByTestId('showcase-drawer-budgets').tap();
  await expect(
    screen.getByText('Monthly Budget', { visible: true })
  ).toBeVisible();
  await screen.getByTestId('showcase-drawer-toggle', { visible: true }).tap();
  await screen.getByTestId('showcase-drawer-accounts').tap();
  await expect(
    screen.getByText('Main Checking', { visible: true })
  ).toBeVisible();
});
