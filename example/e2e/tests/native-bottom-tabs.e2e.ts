import { expect } from 'e2e';

import { expectScrolledOutOfView, getTab, test } from '../fixtures';

test('Native Bottom Tabs - Basic', async ({ launch, screen, scroll }) => {
  await launch('native-bottom-tabs', 'Article by Gandalf');

  await screen.getByRole('button', 'Update params').first().tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();

  await screen.getByRole('button', 'Navigate to feed').first().tap();
  await expect(
    screen.getByRole('button', 'Replace with contacts')
  ).toBeVisible();

  await getTab(screen, 'Albums').tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();

  await screen.getByRole('button', 'Go to Contacts').first().tap();
  await expect(
    screen.getByText('Marissa Castillo', { visible: true })
  ).toBeVisible();

  await scroll();
  await expectScrolledOutOfView(
    screen.getByText('Marissa Castillo', { visible: true })
  );

  // Pressing the focused tab scrolls to top
  await getTab(screen, 'Contacts').tap();
  await expect(
    screen.getByText('Marissa Castillo', { visible: true })
  ).toBeVisible();

  await getTab(screen, 'Albums').tap();
  await expect(screen.getByTestId('album-0', { visible: true })).toBeVisible();

  await getTab(screen, 'Article').tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();

  await screen.getByRole('button', 'Navigate to feed').first().tap();
  await expect(
    screen.getByRole('button', 'Replace with contacts')
  ).toBeVisible();

  // Pressing the focused tab pops to top
  await getTab(screen, 'Article').tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();

  await getTab(screen, 'Feed').tap();
  await expect(
    screen.getByText('Joke bot', { visible: true }).first()
  ).toBeVisible();

  const joke = screen.getByText(
    'Someone broke into my house and stole 20% of my couch. Ouch!',
    { visible: true }
  );

  await screen.scrollUntilVisible(joke);
  await expect(joke).toBeVisible();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeHidden();

  await getTab(screen, 'Article').tap();
  await expect(
    screen.getByText('Article by Babel fish', { visible: true })
  ).toBeVisible();
});
