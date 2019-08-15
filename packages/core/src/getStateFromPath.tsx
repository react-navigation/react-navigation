import { InitialState } from './types';

/**
 * Utility to parse a path string to initial state object accepted by the container.
 * This is useful for deep linking when we need to handle the incoming URL.
 *
 * @param path Path string to parse and convert, e.g. /foo/bar?count=42.
 */
export default function getStateFromPath(
  path: string
): InitialState | undefined {
  const parts = path.split('?');
  const segments = parts[0].split('/').filter(Boolean);
  const query = parts[1] ? parts[1].split('&') : undefined;

  let result: InitialState | undefined;
  let current: InitialState | undefined;

  while (segments.length) {
    const state = {
      stale: true as true,
      routes: [{ name: decodeURIComponent(segments[0]) }],
    };

    if (current) {
      current.routes[0].state = state;
    } else {
      result = state;
    }

    current = state;
    segments.shift();
  }

  if (current == null || result == null) {
    return undefined;
  }

  if (query) {
    const params = query.reduce<{ [key: string]: any }>((acc, curr) => {
      const [key, value] = curr.split('=');

      acc[decodeURIComponent(key)] = JSON.parse(decodeURIComponent(value));

      return acc;
    }, {});

    current.routes[0].params = params;
  }

  return result;
}
