import { expect } from 'e2e';

import { test } from '../fixtures';

test('Native Bottom Tabs - Custom Tab Bar', async ({ launch, screen }) => {
  await launch('native-bottom-tabs-custom-tab-bar', 'What is Lorem Ipsum?');
  await screen.getByTestId('albums').tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();
  await expect(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  ).toBeHidden();
  await screen.getByRole('button', 'Go to Contacts').first().tap();
  await expect(
    screen.getByText('Marissa Castillo', { visible: true })
  ).toBeVisible();
  await screen.getByTestId('albums').tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();
  await expect(
    screen.getByText('Marissa Castillo', { visible: true })
  ).toBeHidden();
  await screen.getByTestId('contacts').tap();
  await expect(
    screen.getByText('Marissa Castillo', { visible: true })
  ).toBeVisible();
  await screen.getByTestId('article').tap();
  await expect(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  ).toBeVisible();
});
