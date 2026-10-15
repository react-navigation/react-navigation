import { test } from '../fixtures';

test('Tab View - Auto Width Tab Bar', async ({
  launch,
  screen,
  expectInViewport,
}) => {
  await launch('libraries-tab-view/auto-width-tab-bar', 'Marissa Castillo');
  await screen.getByLabel('Article').tap();
  await expectInViewport(
    // Multiple tabs show the article
    screen.getByText('What is Lorem Ipsum?', { visible: true }).first()
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
});
