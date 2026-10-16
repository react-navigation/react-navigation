import { test } from '../fixtures';

test('Tab View - Custom Tab Bar', async ({
  launch,
  screen,
  swipe,
  expectInViewport,
}) => {
  await launch('libraries-tab-view/custom-tab-bar', 'Custom tab bar');
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
  await screen.getByTestId('albums').tap();
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
  await screen.getByTestId('article').tap();
  await expectInViewport(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  );
  await screen.getByTestId('chat').tap();
  await expectInViewport(
    screen.getByText('make me a sandwich', { visible: true })
  );
  await screen.getByTestId('contacts').tap();
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
  await swipe('right');
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
  await swipe('right');
  await expectInViewport(
    screen.getByText('What is Lorem Ipsum?', { visible: true })
  );
  await swipe('left');
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
});
