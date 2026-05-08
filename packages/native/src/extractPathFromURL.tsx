import escapeStringRegexp from 'escape-string-regexp';

export function extractPathFromURL(prefixes: string[], url: string) {
  for (const prefix of prefixes) {
    const protocol = prefix.match(/^[^:]+:/)?.[0] ?? '';
    const host = prefix
      .replace(new RegExp(`^${escapeStringRegexp(protocol)}`), '')
      .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
      .replace(/^\//, ''); // Remove extra leading slash

    const prefixRegex = new RegExp(
      `^${escapeStringRegexp(protocol)}(/)*${host
        .split('.')
        .map((it) => (it === '*' ? '[^/?#]+' : escapeStringRegexp(it)))
        .join('\\.')}${host === '' || host.endsWith('/') ? '' : '(?=$|[/?#])'}`
    );

    const [originAndPath, ...searchParams] = url.split('?');
    const normalizedURL = originAndPath
      .replace(/\/+/g, '/')
      .concat(searchParams.length ? `?${searchParams.join('?')}` : '');

    if (prefixRegex.test(normalizedURL)) {
      const result = normalizedURL.replace(prefixRegex, '');

      return result.startsWith('?') || result.startsWith('#')
        ? `/${result}`
        : result;
    }
  }

  return undefined;
}
