import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
  await page.getByText('Link').click();
});

test('loads the article screen', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();

  await expect(page.getByRole('link', { name: 'Go to Home' })).toHaveAttribute(
    'href',
    '/'
  );
});

test('replaces and pushes params', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  await page.getByRole('button', { name: 'Push params' }).click();

  await page.waitForURL('**/components-link/article/babel-fish');

  await expect(page).toHaveTitle(
    'Article by Babel fish - React Navigation Example'
  );

  await page.getByRole('button', { name: 'Push params' }).click();

  await page.waitForURL('**/components-link/article/gandalf');

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await page.getByRole('link', { name: 'Go back' }).click();

  await page.waitForURL('**/components-link/article/babel-fish');

  await expect(page).toHaveTitle(
    'Article by Babel fish - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Babel fish' })
  ).toBeVisible();

  await page.getByRole('link', { name: 'Go back' }).click();

  await page.waitForURL('**/components-link/article/gandalf');

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();

  await page.getByRole('button', { name: 'Replace params' }).click();

  await page.waitForURL('**/components-link/article/babel-fish');

  await expect(page).toHaveTitle(
    'Article by Babel fish - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Babel fish' })
  ).toBeVisible();
});

test('goes to the album screen and goes back', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  const link = page.getByRole('link', {
    name: 'Go to albums',
    exact: true,
  });

  await expect(link).toHaveAttribute('href', '/components-link/albums');

  await link.click();

  await page.waitForURL('**/components-link/albums');

  await expect(page).toHaveTitle('Albums - React Navigation Example');

  await expect(page.getByRole('heading', { name: 'Albums' })).toBeVisible();

  await expect(page.getByLabel('Home, back')).not.toBeVisible();

  await page.getByLabel('Article by Gandalf, back').click();

  await page.waitForURL('**/components-link/article/gandalf');

  await expect(page).toHaveTitle(
    'Article by Gandalf - React Navigation Example'
  );

  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();
});

test('does not navigate when a link is disabled', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  const link = page.getByRole('link', { name: 'Go to albums (Disabled)' });

  await expect(link).toHaveAttribute('href', '/components-link/albums');
  await expect(link).toHaveAttribute('aria-disabled', 'true');

  // Ensure disabled link clicks don't bubble up
  await page.evaluate(() => {
    document.body.dataset.disabledLinkClicks = '0';
    document.addEventListener(
      'click',
      () => {
        document.body.dataset.disabledLinkClicks = '1';
      },
      { once: true }
    );
  });

  await link.click({ force: true });

  await expect(page.locator('body')).toHaveAttribute(
    'data-disabled-link-clicks',
    '0'
  );

  await expect(page).toHaveURL('/components-link/article/gandalf');
  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();
});

for (const modifier of ['Alt', 'Control', 'Meta', 'Shift'] as const) {
  test(`lets the browser handle clicks with the ${modifier} key`, async ({
    page,
  }) => {
    await page.waitForURL('**/components-link/article/gandalf');

    const link = page.getByRole('link', {
      name: 'Go to albums',
      exact: true,
    });

    await page.evaluate(() => {
      document.addEventListener('click', (event) => event.preventDefault(), {
        once: true,
      });
    });

    await link.click({ modifiers: [modifier] });

    await expect(page).toHaveURL('/components-link/article/gandalf');
    await expect(
      page.getByRole('heading', { name: 'Article by Gandalf' })
    ).toBeVisible();
  });
}

for (const modifier of ['Alt', 'Control', 'Meta', 'Shift'] as const) {
  test(`does not open a disabled link with the ${modifier} key`, async ({
    page,
  }) => {
    await page.waitForURL('**/components-link/article/gandalf');

    await page
      .getByRole('link', { name: 'Go to albums (Disabled)' })
      .click({ force: true, modifiers: [modifier] });

    expect(page.context().pages()).toHaveLength(1);

    await expect(page).toHaveURL('/components-link/article/gandalf');
  });
}

test('does not open a disabled link with a middle click', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  await page.evaluate(() => {
    document.body.dataset.disabledLinkClicks = '0';
    document.addEventListener(
      'auxclick',
      () => {
        document.body.dataset.disabledLinkClicks = '1';
      },
      { once: true }
    );
  });

  await page
    .getByRole('link', { name: 'Go to albums (Disabled)' })
    .click({ button: 'middle', force: true });

  await expect(page.locator('body')).toHaveAttribute(
    'data-disabled-link-clicks',
    '0'
  );

  expect(page.context().pages()).toHaveLength(1);

  await expect(page).toHaveURL('/components-link/article/gandalf');
});

test('navigates in the current page with target=_self', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  const link = page.getByRole('link', {
    name: 'Open albums in current tab',
  });

  const timeOrigin = await page.evaluate(() => performance.timeOrigin);

  await expect(link).toHaveAttribute('target', '_self');

  await link.click();

  await page.waitForURL('**/components-link/albums');

  await expect(page.getByRole('heading', { name: 'Albums' })).toBeVisible();
  expect(await page.evaluate(() => performance.timeOrigin)).toBe(timeOrigin);
});

test('opens a new page with target=_blank', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  const link = page.getByRole('link', { name: 'Open albums in new tab' });

  await expect(link).toHaveAttribute('target', '_blank');

  const [targetPage] = await Promise.all([
    page.waitForEvent('popup'),
    link.click(),
  ]);

  await targetPage.waitForURL('**/components-link/albums');

  await expect(
    targetPage.getByRole('heading', { name: 'Albums' })
  ).toBeVisible();

  await expect(page).toHaveURL('/components-link/article/gandalf');

  await targetPage.close();
});

test('replaces article with the album screen', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  const link = page.getByRole('link', {
    name: 'Replace with albums',
  });

  await expect(link).toHaveAttribute('href', '/components-link/albums');

  await link.click();

  await page.waitForURL('**/components-link/albums');

  await expect(page).toHaveTitle('Albums - React Navigation Example');

  await expect(page.getByRole('heading', { name: 'Albums' })).toBeVisible();

  await expect(page.getByLabel('Article by Gandalf, back')).not.toBeVisible();

  await page.getByLabel('Home, back').click();

  await page.waitForURL('**/');
});

test('preserves hash for navigation', async ({ page }) => {
  await page.waitForURL('**/components-link/article/gandalf');

  await page.getByText('Add hash to URL').click();

  await page.waitForURL('**/components-link/article/gandalf#frodo');

  await page.getByRole('button', { name: 'Replace params' }).click();

  await page.waitForURL('**/components-link/article/babel-fish#frodo');

  await page.reload();

  await page.waitForURL('**/components-link/article/babel-fish#frodo');

  await expect(page).toHaveTitle(
    'Article by Babel fish - React Navigation Example'
  );

  await page.getByRole('link', { name: 'Replace with albums' }).click();

  await page.waitForURL('**/components-link/albums');
});
