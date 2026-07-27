import { expect, test } from '@playwright/test';

test('hydrates the example app without errors', async ({ page }) => {
  const hydrationErrors: string[] = [];

  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|hydrate/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    if (/hydration|hydrate/i.test(error.message)) {
      hydrationErrors.push(error.message);
    }
  });

  await page.goto('/', { waitUntil: 'networkidle' });

  await expect(page).toHaveTitle('Examples - React Navigation Example');
  await expect(page.getByRole('heading', { name: 'Examples' })).toBeVisible();

  expect(hydrationErrors).toEqual([]);
});

test('hydrates a linked route without errors', async ({ page }) => {
  const hydrationErrors: string[] = [];

  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|hydrate/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    if (/hydration|hydrate/i.test(error.message)) {
      hydrationErrors.push(error.message);
    }
  });

  await page.goto('/native-stack/article/gandalf', {
    waitUntil: 'networkidle',
  });

  await expect(
    page.getByRole('heading', { name: 'Article by Gandalf' })
  ).toBeVisible();

  expect(hydrationErrors).toEqual([]);
});

test('hydrates a route with a loader without errors', async ({ page }) => {
  const hydrationErrors: string[] = [];

  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|hydrate/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });

  page.on('pageerror', (error) => {
    if (/hydration|hydrate/i.test(error.message)) {
      hydrationErrors.push(error.message);
    }
  });

  await page.goto('/loaders/dino/1', { waitUntil: 'networkidle' });

  await expect(page.getByText('Tyrannosaurus rex')).toBeVisible();

  expect(hydrationErrors).toEqual([]);
});

test('hydrates a suspended screen without errors', async ({ page }) => {
  const hydrationErrors: string[] = [];

  page.on('console', (message) => {
    if (
      message.type() === 'error' &&
      /hydration|hydrate/i.test(message.text())
    ) {
      hydrationErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    if (/hydration|hydrate/i.test(error.message)) {
      hydrationErrors.push(error.message);
    }
  });

  await page.goto('/screen-layout/suspense', { waitUntil: 'networkidle' });

  await expect(page.getByText('Suspend')).toBeVisible();

  expect(hydrationErrors).toEqual([]);
});
