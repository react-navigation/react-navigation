import { expect, test as it } from '@playwright/test';
import cheerio from 'cheerio';
import fetch from 'node-fetch';

const server = 'http://localhost:3275';

it('renders the home page', async () => {
  const res = await fetch(server);
  const html = await res.text();

  const $ = cheerio.load(html);

  expect($('title').text()).toBe('Examples');
});
