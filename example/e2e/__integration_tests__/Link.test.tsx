import { page } from '../config/setup-playwright';

beforeEach(async () => {
  await page.click('[data-testid=LinkComponent]');
});

it('loads the article page', async () => {
  expect(await page.evaluate(() => location.pathname + location.search)).toBe(
    '/link-component/Article?author=Gandalf'
  );
  expect(
    ((await page.accessibility.snapshot()) as any)?.children?.find(
      (it: any) => it.role === 'heading'
    )?.name
  ).toBe('Article by Gandalf');
});

it('goes to the album page and goes back', async () => {
  await page.click('[href="/link-component/Album"]');

  expect(await page.evaluate(() => location.pathname + location.search)).toBe(
    '/link-component/Album'
  );

  expect(
    ((await page.accessibility.snapshot()) as any)?.children?.find(
      (it: any) => it.role === 'heading'
    )?.name
  ).toBe('Album');

  await page.click('[aria-label="Article by Gandalf, back"]');

  await page.waitForNavigation();

  expect(await page.evaluate(() => location.pathname + location.search)).toBe(
    '/link-component/Article?author=Gandalf'
  );

  expect(
    ((await page.accessibility.snapshot()) as any)?.children?.find(
      (it: any) => it.role === 'heading'
    )?.name
  ).toBe('Article by Gandalf');
});
