import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Retain', async ({ launch, screen }) => {
  await launch('stack-retain', "Let's Go!");
  await screen.getByRole('button', "Let's Go!").first().tap();
  await expect(screen.getByText('Retain', { visible: true })).toBeVisible();
  await expect(screen.getByText('0', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Retain').first().tap();
  await expect(screen.getByText('📌', { visible: true })).toBeVisible();
  await expect(screen.getByText('3', { visible: true })).toBeVisible();
  await screen.getByTestId('Go back').tap();
  await screen.getByRole('button', "Let's Go!").first().tap();
  await expect(screen.getByText('3', { visible: true })).toBeVisible();
  await expect(screen.getByText('📌', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Unretain').first().tap();
  await screen.getByTestId('Go back').tap();
  await screen.getByRole('button', "Let's Go!").first().tap();
  await expect(screen.getByText('📌', { visible: true })).toBeHidden();
  await expect(screen.getByText('Retain', { visible: true })).toBeVisible();
  await expect(screen.getByText('0', { visible: true })).toBeVisible();
});
