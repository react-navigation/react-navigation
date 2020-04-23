import { page } from '../config/setup-playwright';

it('loads the example app', async () => {
  const snapshot = await page.accessibility.snapshot();

  // @ts-ignore
  expect(snapshot?.children?.find((it) => it.role === 'heading')?.name).toBe(
    'Examples'
  );
  const title = await page.$eval('[role=heading]', (el) => el.textContent);

  expect(title).toBe('Examples');
});
