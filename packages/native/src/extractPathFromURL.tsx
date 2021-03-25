import escapeStringRegexp from 'escape-string-regexp';

export default function extractPathFromURL(prefixes: string[], url: string) {
  for (const prefix of prefixes) {
    const protocol = prefix.match(/^[^:]+:/)?.[0] ?? '';
    const host = prefix
      .replace(new RegExp(`^${escapeStringRegexp(protocol)}`), '')
      .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
      .replace(/^\//, ''); // Remove extra leading slash

    const prefixRegex = new RegExp(
      `^${escapeStringRegexp(protocol)}(/)*${host
        .split('.')
        .map((it) => (it === '*' ? '[^/]+' : escapeStringRegexp(it)))
        .join('\\.')}`
    );

    const normalizedURL = url.replace(/\/+/g, '/');

    if (prefixRegex.test(normalizedURL)) {
      return normalizedURL.replace(prefixRegex, '');
    }
  }

  return undefined;
}
