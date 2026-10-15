import { test } from '../fixtures';

test('Material Top Tabs - Basic', async ({
  launch,
  screen,
  swipe,
  expectInViewport,
}) => {
  await launch('material-top-tabs-basic', 'Chat');
  await expectInViewport(
    screen.getByText('make me a sandwich', { visible: true })
  );
  await screen.getByLabel('Contacts').tap();
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
  await screen.getByLabel('Albums').tap();
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
  await screen.getByLabel('Chat').tap();
  await expectInViewport(
    screen.getByText('make me a sandwich', { visible: true })
  );
  await swipe('right');
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
  await swipe('right');
  await expectInViewport(screen.getByTestId('album-0', { visible: true }));
  await swipe('left');
  await expectInViewport(
    screen.getByText('Marissa Castillo', { visible: true })
  );
});
