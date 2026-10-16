import { expect } from 'e2e';

import { test } from '../fixtures';

test('Stack - Prevent Remove', async ({ launch, dialog, screen, platform }) => {
  const discard = screen.getByRole('button', 'Discard and go back').first();
  const article = screen.getByText('What is Lorem Ipsum?', { visible: true });

  await launch('stack-prevent-remove', 'Input');

  await screen.getByRole('button', 'Push Article').first().tap();
  await expect(article).toBeVisible();

  await screen.getByRole('button', 'Push Input').first().tap();
  await expect(discard).toBeVisible();

  // The first screen in the stack also has an input
  await screen
    .getByPlaceholder('Type something…', { visible: true })
    .last()
    .fill('hello');

  if (platform === 'web') {
    await dialog('dismiss');
    await discard.tap();
    await expect(discard).toBeVisible();

    await dialog('accept');
    await discard.tap();
  } else {
    await discard.tap();
    // Android shows the buttons of alerts in uppercase
    await screen.getByRole('button', /^Don't leave$/i).tap();
    await expect(discard).toBeVisible();

    await discard.tap();
    await screen.getByRole('button', /^Discard$/i).tap();
  }

  await expect(article).toBeVisible();

  if (platform === 'ios') {
    // Taps during the transition are ignored, so wait for the input screen to be removed
    await expect(discard).toBeHidden();
  }

  await screen.getByRole('button', 'Pop to top').first().tap();
  await expect(
    screen.getByRole('button', 'Push Article').first()
  ).toBeVisible();
});
