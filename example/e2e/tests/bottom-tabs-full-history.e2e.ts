import { expect } from 'e2e';

import { test } from '../fixtures';

test('Bottom Tabs - Full History', async ({ launch, screen }) => {
  await launch('bottom-tabs-full-history', 'Tab First (-)');
  await screen.getByRole('button', 'Navigate to Second').first().tap();
  await expect(
    screen.getByText('Tab Second (1)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Navigate to First').first().tap();
  await expect(
    screen.getByText('Tab First (2)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Navigate to Third').first().tap();
  await expect(
    screen.getByText('Tab Third (3)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Navigate to Second').first().tap();
  await expect(
    screen.getByText('Tab Second (4)', { visible: true })
  ).toBeVisible();
  await screen.getByTestId('first-tab').tap();
  await expect(
    screen.getByText('Tab First (2)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Go back').first().tap();
  await expect(
    screen.getByText('Tab Second (4)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Go back').first().tap();
  await expect(
    screen.getByText('Tab Third (3)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Go back').first().tap();
  await expect(
    screen.getByText('Tab First (2)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Go back').first().tap();
  await expect(
    screen.getByText('Tab Second (1)', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Go back').first().tap();
});
