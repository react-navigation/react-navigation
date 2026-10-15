import { test } from '../fixtures';

test('Tab View - Scrollable Tab Bar', async ({
  launch,
  screen,
  swipe,
  expectInViewport,
}) => {
  await launch('libraries-tab-view/scrollable-tab-bar', 'Contacts');
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
  await screen.getByLabel('Article').tap();
  await expectInViewport(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  );
  await screen.getByLabel('Albums').tap();
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
  await screen.getByLabel('Chat').tap();
  await expectInViewport(
    screen.getByText('make me a sandwich', { visible: true })
  );
  await screen.getByLabel('Contacts').tap();
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
  await swipe('right');
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
  await swipe('right');
  await expectInViewport(
    screen.getByText('make me a sandwich', { visible: true })
  );
  await swipe('left');
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
});
