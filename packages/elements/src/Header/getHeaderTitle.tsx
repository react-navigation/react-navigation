import type { HeaderOptions } from '../types';

export function getHeaderTitle(
  options: {
    title?: string | undefined;
    headerTitle?: HeaderOptions['headerTitle'];
  },
  fallback: string
): string {
  return typeof options.headerTitle === 'string'
    ? options.headerTitle
    : options.title !== undefined
      ? options.title
      : fallback;
}
