import { expect, test as it } from '@playwright/test';

const server = 'http://localhost:3275';

it('renders the home page', async () => {
  const res = await fetch(server);
  const html = await res.text();

  expect(html).toContain('<!DOCTYPE html>');
  expect(html).toContain('id="root"');
});

it('renders a linked route from the request location', async () => {
  const res = await fetch(`${server}/stack-basic`);
  const html = await res.text();

  expect(html).toContain('Article by Gandalf');
});

it('streams the shell before suspended content', async () => {
  const res = await fetch(`${server}/screen-layout/suspense`);

  expect(res.ok).toBe(true);
  expect(res.body).not.toBeNull();

  const reader = res.body!.getReader();
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
