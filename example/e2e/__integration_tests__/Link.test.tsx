import { page } from '../config/setup-playwright';

beforeEach(async () => {
  await page.click('[data-testid=LinkComponent]');
});

const getPageInfo = async () => ({
  url: await page.evaluate(() => location.pathname + location.search),
  title: await page.evaluate(() => document.title),
  heading: (await page.accessibility.snapshot())?.children?.find(
    (it) => it.role === 'heading'
  )?.name,
});

it('loads the article page', async () => {
  const { url, title, heading } = await getPageInfo();

  expect(url).toBe('/link-component/article/gandalf');
  expect(title).toBe('Article by Gandalf - React Navigation Example');
  expect(heading).toBe('Article by Gandalf');
});

it('goes to the album page and goes back', async () => {
  await page.click('[href="/link-component/music"]');

  {
    const { url, title, heading } = await getPageInfo();

    expect(url).toBe('/link-component/music');
    expect(title).toBe('Albums - React Navigation Example');
    expect(heading).toBe('Albums');
  }

  await page.click('[aria-label="Article by Gandalf, back"]');
  await page.waitForNavigation();

  {
    const { url, title, heading } = await getPageInfo();

    expect(url).toBe('/link-component/article/gandalf');
    expect(title).toBe('Article by Gandalf - React Navigation Example');
    expect(heading).toBe('Article by Gandalf');
  }
});
