import { expect, test as it } from '@playwright/test';

it('renders the home page', async ({ request }) => {
  const res = await request.get('/');
  const html = await res.text();

  expect(html).toContain('id="root"');
});

it('renders a linked route from the request location', async ({ request }) => {
  const res = await request.get('/stack-basic');
  const html = await res.text();

  expect(html).toContain('Article by Gandalf');
});

it('streams the shell before suspended content', async ({ baseURL }) => {
  const res = await fetch(`${baseURL}/screen-layout/suspense`);

  expect(res.ok).toBe(true);

  if (res.body == null) {
    throw new Error('Response body was empty');
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  let html = '';

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    html += decoder.decode(value, { stream: true });

    if (html.includes('Loading')) {
      break;
    }
  }

  expect(html).toContain('Loading');
  expect(html).not.toContain('Suspend');

  while (true) {
    const { value, done } = await reader.read();

    if (done) {
      break;
    }

    html += decoder.decode(value, { stream: true });
  }

  html += decoder.decode();

  expect(html).toContain('Suspend');
});
