import { expect } from 'e2e';

import { getTab, test } from '../fixtures';

test('Showcase - Bottom Tabs', async ({ launch, open, screen, platform }) => {
  // The header, the content and the now playing bar can show the same album
  const albumText = (text: string) =>
    screen.getByText(text, { visible: true }).first();

  await launch('bottom-tabs-showcase', 'Midnight Waves');
  await expect(getTab(screen, 'Albums')).toBeSelected();

  await screen.getByTestId('open-album-albums').tap();
  await expect(getTab(screen, 'Albums')).toBeSelected();
  await expect(albumText('Midnight Waves')).toBeVisible();
  await expect(albumText('Luna Echo')).toBeVisible();

  await getTab(screen, 'For You').tap();
  await expect(getTab(screen, 'For You')).toBeSelected();

  await screen.getByTestId('open-album-for-you').tap();
  await expect(getTab(screen, 'For You')).toBeSelected();
  await expect(albumText('Quiet Hours')).toBeVisible();
  await expect(albumText('Amber Field')).toBeVisible();

  await getTab(screen, 'Radio').tap();
  await expect(screen.getByText('Velvet FM', { visible: true })).toBeVisible();
  await expect(getTab(screen, 'Radio')).toBeSelected();

  await getTab(screen, 'For You').tap();
  await expect(getTab(screen, 'For You')).toBeSelected();
  await expect(albumText('Quiet Hours')).toBeVisible();

  await open('bottom-tabs-showcase/album/12');

  // On the web, opening a link results in a fresh page load
  await expect(
    getTab(screen, platform === 'web' ? 'Albums' : 'For You')
  ).toBeSelected();
  await expect(albumText('Signal Lost')).toBeVisible();
  await expect(albumText('Pixel Drift')).toBeVisible();

  await getTab(screen, 'Search').tap();
  await expect(
    screen.getByText('Browse Categories', { visible: true })
  ).toBeVisible();

  // On iOS, the search bar is shown and focused when the tab is selected
  if (platform === 'android') {
    await screen.getByRole('image', 'Search').tap();
  } else if (platform === 'web') {
    await screen.getByRole('button', 'Search').tap();
  }

  await screen
    .getByPlaceholder('Artists, songs, albums', { visible: true })
    .fill('Chrome');

  // The title and the artist are merged into the label on iOS
  await screen.getByRole('button', /^Chrome Valley/).tap();
  await expect(
    screen.getByText('Silver Thread', { visible: true })
  ).toBeVisible();

  await getTab(screen, 'Albums').tap();
  await expect(getTab(screen, 'Albums')).toBeSelected();
  await expect(
    screen.getByText('Silver Thread', { visible: true })
  ).toBeHidden();
});
