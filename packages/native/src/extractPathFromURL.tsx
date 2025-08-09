import escapeStringRegexp from 'escape-string-regexp';

import type { LinkingPrefix } from './types';

export function extractPathFromURL(prefixes: LinkingPrefix[], url: string) {
  for (const prefix of prefixes) {
    let prefixRegex;

    if (prefix === '*') {
      prefixRegex = /^(((https?:\/\/)[^/]+)|([^/]+:(\/\/)?))/;
    } else {
      const protocol = prefix.match(/^[^:]+:/)?.[0] ?? '';
      const host = prefix
        .replace(new RegExp(`^${escapeStringRegexp(protocol)}`), '')
        .replace(/\/+/g, '/') // Replace multiple slash (//) with single ones
        .replace(/^\//, ''); // Remove extra leading slash

      prefixRegex = new RegExp(
        `^${escapeStringRegexp(protocol)}(/)*${host
          .split('.')
          .map((it) => (it === '*' ? '[^/]+' : escapeStringRegexp(it)))
          .join('\\.')}`
      );
    }

    const [originAndPath, ...searchParams] = url.split('?');

    if (prefixRegex.test(originAndPath)) {
      return originAndPath
        .replace(prefixRegex, '')
        .replace(/\/+/g, '/')
        .concat(searchParams.length ? `?${searchParams.join('?')}` : '');
    }
  }

  return undefined;
}
