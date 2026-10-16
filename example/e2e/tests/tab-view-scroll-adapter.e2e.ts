import { test } from '../fixtures';

test('Tab View - Scroll Adapter', async ({
  launch,
  screen,
  expectInViewport,
}) => {
  await launch('libraries-tab-view/scroll-adapter', 'Marissa Castillo');
  await screen.getByLabel('Article').tap();
  await expectInViewport(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  );
  await screen.getByLabel('Albums').tap();
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
  await screen.getByLabel('Contacts').tap();
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
});
