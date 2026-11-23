import { describe, expect } from 'e2e';

import { test } from '../fixtures';

describe('Native Stack - Prevent Remove', () => {
  test.beforeEach(async ({ launch, screen }) => {
    await launch('native-stack-prevent-remove', 'Input');

    await screen.getByRole('button', 'Push Article').first().tap();
    await expect(
      screen.getByText('What is Lorem Ipsum?', { visible: true })
    ).toBeVisible();

    await screen.getByRole('button', 'Push Input').first().tap();
    await expect(
      screen.getByRole('button', 'Discard and go back').first()
    ).toBeVisible();

    // The first screen in the stack also has an input
    await screen
      .getByPlaceholder('Type something…', { visible: true })
      .last()
      .fill('hello');
  });

  test(
    'asks before leaving with a browser dialog',
    { requires: ['browser'] },
    async ({ screen, browser }) => {
      const discard = screen.getByRole('button', 'Discard and go back').first();

      const off = await browser.onDialog('dismiss');

      await discard.tap();
      await expect(discard).toBeVisible();
      await off();

      await browser.onDialog('accept');
      await discard.tap();

      await expect(
        screen.getByText('What is Lorem Ipsum?', { visible: true })
      ).toBeVisible();

      await screen.getByRole('button', 'Pop to top').first().tap();
      await expect(
        screen.getByRole('button', 'Push Article').first()
      ).toBeVisible();
    }
  );

  test(
    'asks before leaving with an alert',
    { requires: ['device'] },
    async ({ screen, platform }) => {
      const discard = screen.getByRole('button', 'Discard and go back').first();

      await discard.tap();
      // Android shows the buttons of alerts in uppercase
      await screen.getByRole('button', /^Don't leave$/i).tap();
      await expect(discard).toBeVisible();

      await discard.tap();
      await screen.getByRole('button', /^Discard$/i).tap();

      await expect(
        screen.getByText('What is Lorem Ipsum?', { visible: true })
      ).toBeVisible();

      if (platform === 'ios') {
        // Taps during the transition are ignored, so wait for the input screen to be removed
        await expect(discard).toBeHidden();
      }

      await screen.getByRole('button', 'Pop to top').first().tap();
      await expect(
        screen.getByRole('button', 'Push Article').first()
      ).toBeVisible();
    }
  );
});
