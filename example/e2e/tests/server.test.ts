import { expect, test as it } from '@playwright/test';

const server = 'http://localhost:3275';

it('renders the home page', async () => {
  const res = await fetch(server);
  const html = await res.text();

  expect(html).toMatch(/<title>\s*Examples\s*<\/title>/i);
});
