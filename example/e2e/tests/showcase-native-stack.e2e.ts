import { expect } from 'e2e';

import { test } from '../fixtures';

test('Showcase - Native Stack', async ({ launch, screen }) => {
  await launch('native-stack-showcase', 'Lake Tahoe');

  await screen.getByRole('button', 'Places').first().tap();
  await expect(screen.getByText('Places', { visible: true })).toBeVisible();

  await screen.getByTestId('showcase-native-stack-place-1').tap();
  await expect(screen.getByText('4.8 rating', { visible: true })).toBeVisible();
  await expect(
    screen.getByText('Lake Tahoe', { visible: true }).first()
  ).toBeVisible();
  await expect(
    screen.getByText('Sierra Nevada, CA/NV', { visible: true }).first()
  ).toBeVisible();
});
