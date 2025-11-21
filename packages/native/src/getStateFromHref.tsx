import { getStateFromPath, type ParamListBase } from '@react-navigation/core';

import { extractPathFromURL } from './extractPathFromURL';
import type { LinkingOptions } from './types';

export function getStateFromHref(
  href: string,
  options: LinkingOptions<ParamListBase> | undefined
): ReturnType<typeof getStateFromPath> {
  const {
    prefixes,
    filter,
    config,
    getStateFromPath: getStateFromPathHelper = getStateFromPath,
  } = options || {};

  let path;

  if (href.startsWith('/')) {
    path = href;
  } else if (href) {
    if (filter && !filter(href)) {
      throw new Error(
        `Failed to parse href '${href}'. It doesn't match the filter specified in linking config.`
      );
    }

    if (prefixes == null || prefixes.length === 0) {
      throw new Error(
        `Failed to parse href '${href}'. It doesn't start with '/' and no prefixes are defined in linking config.`
      );
    }

    path = extractPathFromURL(prefixes, href);
  }

  if (path == null) {
    throw new Error(
      `Got invalid href '${href}'. It must start with '/' or match one of the prefixes: ${options?.prefixes?.map((prefix) => `'${prefix}'`).join(', ')}.`
    );
  }

  const state = getStateFromPathHelper(path, config);

  return state;
}
