import { expect } from 'e2e';

import { test } from '../fixtures';

test('Showcase - Material Top Tabs', async ({ launch, screen, swipe }) => {
  const swipeToTab = async (tab: string, text: string) => {
    await swipe('right');
    await expect(screen.getByLabel(tab).first()).toBeSelected();
    // Some recipes show up in multiple tabs, so check the last match
    await expect(
      screen.getByText(text, { visible: true }).last()
    ).toBeVisible();
  };

  await launch(
    'material-top-tabs-showcase',
    'Lemon Herb Risotto with Spring Peas'
  );

  await swipeToTab('Breakfast', 'Morning Favorites');
  await swipeToTab('Lunch', 'Light & Fresh');
  await swipeToTab('Dinner', 'Crowd Pleasers');
  await swipeToTab('Desserts', 'Lemon Tart with Meringue');
  await swipeToTab('Drinks', 'Lavender Honey Latte');
  await swipeToTab('Saved', 'Pan-Seared Salmon with Dill Sauce');
  await swipeToTab('Seasonal', "What's in Season");
});
