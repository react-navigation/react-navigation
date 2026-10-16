import { test } from '../fixtures';

test('Tab View - Coverflow', async ({
  launch,
  screen,
  scroll,
  expectInViewport,
}) => {
  // The pager is a scroll view that's only as tall as the albums
  const scrollAlbum = async (direction: 'left' | 'right', album: string) => {
    await scroll(direction, screen.getByText(album, { visible: true }));
  };

  await launch('libraries-tab-view/coverflow', 'Homogenic');
  await expectInViewport(screen.getByText('Homogenic', { visible: true }));

  await scrollAlbum('right', 'Homogenic');
  await expectInViewport(
    screen.getByText('Number of the Beast', { visible: true })
  );

  await scrollAlbum('right', 'Number of the Beast');
  await expectInViewport(screen.getByText("It's Blitz", { visible: true }));

  await scrollAlbum('left', "It's Blitz");
  await expectInViewport(
    screen.getByText('Number of the Beast', { visible: true })
  );

  await scrollAlbum('left', 'Number of the Beast');
  await expectInViewport(screen.getByText('Homogenic', { visible: true }));

  await scrollAlbum('left', 'Homogenic');
  await expectInViewport(
    screen.getByText('Bat Out of Hell', { visible: true })
  );

  await scrollAlbum('right', 'Bat Out of Hell');
  await expectInViewport(screen.getByText('Homogenic', { visible: true }));
});
