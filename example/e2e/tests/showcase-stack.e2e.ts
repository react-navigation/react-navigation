import { expect } from 'e2e';

import { test } from '../fixtures';

test('Showcase - Stack', async ({ launch, screen }) => {
  await launch('stack-showcase', 'Specimens');
  await screen.getByTestId('showcase-stack-dino-1').tap();
  await expect(
    screen.getByText('Quick facts', { visible: true })
  ).toBeVisible();
  await screen.getByTestId('showcase-stack-open-image-viewer').tap();
  await expect(
    screen.getByTestId('showcase-stack-close-image-viewer')
  ).toBeVisible();
  await screen.getByTestId('showcase-stack-close-image-viewer').tap();
  await expect(
    screen.getByText('Quick facts', { visible: true })
  ).toBeVisible();
  await screen.getByTestId('showcase-stack-detail-back').tap();
  await expect(screen.getByText('Specimens', { visible: true })).toBeVisible();
});
