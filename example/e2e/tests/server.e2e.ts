import { describe, expect, test } from 'e2e';

describe('server rendering', { platforms: ['web'] }, () => {
  test('renders the home page', async ({ app }) => {
    const res = await fetch(new URL('/', app.baseUrl));
    const html = await res.text();

    expect(html).toContain('id="root"');
  });

  test('renders a linked route from the request location', async ({ app }) => {
    const res = await fetch(new URL('/stack-basic', app.baseUrl));
    const html = await res.text();

    expect(html).toContain('Article by Gandalf');
  });

  test('streams the shell before suspended content', async ({ app }) => {
    const res = await fetch(new URL('/screen-layout/suspense', app.baseUrl));

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
});
