import { expect } from 'e2e';

import { test } from '../fixtures';

test('Auth Flow', async ({ launch, open, screen }) => {
  await launch('auth-flow', 'Welcome');
  await screen.getByRole('button', 'Sign in').first().tap();
  await expect(screen.getByText('Home', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Go to Chat').first().tap();
  await expect(screen.getByText('Chat', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Sign out').first().tap();
  await expect(screen.getByRole('button', 'Sign in').first()).toBeVisible();
  await open('auth-flow/profile');
  await expect(screen.getByText('Welcome', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Sign in').first().tap();
  await expect(
    screen.getByText('This is your profile', { visible: true })
  ).toBeVisible();
  await screen.getByRole('button', 'Go to Chat').first().tap();
  await expect(screen.getByText('Chat', { visible: true })).toBeVisible();
  await screen.getByRole('button', 'Sign out').first().tap();
  await expect(screen.getByRole('button', 'Sign in').first()).toBeVisible();
  await open('auth-flow');
  await screen.getByRole('button', 'Sign in').first().tap();
  await expect(screen.getByText('Home', { visible: true })).toBeVisible();
});
