import { expect } from 'e2e';

import { test } from '../fixtures';

test('Loaders', async ({
  launch,
  screen,
  app,
  platform,
  dismissErrorOverlay,
}) => {
  const description = screen.getByText(
    /^A small dromaeosaur from late Cretaceous Mongolia/,
    { visible: true }
  );

  await launch('loaders', 'Velociraptor');

  await screen.getByText('Velociraptor', { visible: true }).tap();
  await expect(screen.getByText('Loading…', { visible: true })).toBeVisible();
  await expect(description).toBeHidden();
  await expect(screen.getByText('Velociraptor', { visible: true })).toBeVisible(
    { timeout: 15_000 }
  );
  await expect(description).toBeVisible({ timeout: 15_000 });

  if (platform === 'ios') {
    await screen.getByRole('button', 'Dinos').first().tap();
  } else {
    await app.back();
  }

  await expect(
    screen.getByText('Velociraptor', { visible: true })
  ).toBeVisible();

  await screen.getByText('Team', { visible: true }).tap();

  if (platform === 'web') {
    await expect(screen.getByText('Catalog', { visible: true })).toBeVisible();
    await expect(screen.getByText('Battle', { visible: true })).toBeVisible();
    await expect(
      screen.getByText('Velociraptor', { visible: true })
    ).toBeVisible();
    await expect(
      screen.getByText('Current Team', { visible: true })
    ).toBeHidden();
  } else {
    await expect(screen.getByText('Loading…', { visible: true })).toBeVisible();
    await expect(screen.getByText('Catalog', { visible: true })).toBeHidden();
    await expect(screen.getByText('Battle', { visible: true })).toBeHidden();
    await expect(
      screen.getByText('Velociraptor', { visible: true })
    ).toBeHidden();
  }

  await expect(screen.getByText('Current Team', { visible: true })).toBeVisible(
    { timeout: 15_000 }
  );
  await expect(
    screen.getByText(
      'Tyrannosaurus rex, Triceratops, Velociraptor, Stegosaurus',
      { visible: true }
    )
  ).toBeVisible();

  await screen.getByText('Battle', { visible: true }).tap();
  await expect(screen.getByText('Loading…', { visible: true })).toBeVisible();
  await expect(screen.getByText('Catalog', { visible: true })).toBeVisible();
  await expect(screen.getByText('Team', { visible: true })).toBeVisible();
  await expect(screen.getByText('Battle', { visible: true })).toBeVisible();
  await expect(
    screen.getByText('Brachiosaurus vs Spinosaurus', { visible: true })
  ).toBeHidden();
  await expect(
    screen.getByText('Brachiosaurus vs Spinosaurus', { visible: true })
  ).toBeVisible({ timeout: 15_000 });
  // The tab bar and the heading of the screen both show the title
  await expect(screen.getByText('Battle', { visible: true })).toHaveCount(2);

  await launch('loaders', 'Tyrannosaurus rex');

  const makeNextLoadFail = screen.getByRole('button', 'Make next load fail');

  await screen.scrollUntilVisible(makeNextLoadFail);
  await makeNextLoadFail.tap();
  await screen.getByText('Battle', { visible: true }).tap();

  await dismissErrorOverlay();

  await expect(
    screen.getByText('Failed to load dinosaur.', { visible: true })
  ).toBeVisible();
  await expect(screen.getByText('Try Again', { visible: true })).toBeVisible();
  await expect(
    screen.getByText('Brachiosaurus vs Spinosaurus', { visible: true })
  ).toBeHidden();

  await launch('loaders', 'Tyrannosaurus rex');

  await screen.scrollUntilVisible(makeNextLoadFail);
  await makeNextLoadFail.tap();
  await screen.getByText('Stegosaurus', { visible: true }).tap();

  await dismissErrorOverlay();

  await expect(
    screen.getByText('Failed to load dinosaur.', { visible: true })
  ).toBeVisible();
  await expect(screen.getByText('Try Again', { visible: true })).toBeVisible();
  await expect(screen.getByText('Stegosaurus', { visible: true })).toBeHidden();

  await launch('loaders', 'Tyrannosaurus rex');

  await screen.getByText('Tyrannosaurus rex', { visible: true }).tap();
  await expect(screen.getByText('Go to Pets', { visible: true })).toBeVisible();

  await screen.getByText('Go to Pets', { visible: true }).tap();

  if (platform === 'web') {
    await screen.getByLabel('Dinos, back').tap();
  } else if (platform === 'android') {
    await screen.getByRole('button', 'Navigate up').first().tap();
  } else {
    await screen.getByRole('button', 'Dinos').first().tap();
  }

  await expect(
    screen.getByText('Velociraptor', { visible: true })
  ).toBeVisible();
  await expect(screen.getByText('Go to Pets', { visible: true })).toBeHidden();

  await screen.getByText('Battle', { visible: true }).tap();
  await expect(
    screen.getByText('Brachiosaurus vs Spinosaurus', { visible: true })
  ).toBeVisible({ timeout: 15_000 });
  await expect(
    screen.getByText(
      'Ankylosaurus vs Diplodocus vs Parasaurolophus vs Allosaurus',
      { visible: true }
    )
  ).toBeHidden();
});
