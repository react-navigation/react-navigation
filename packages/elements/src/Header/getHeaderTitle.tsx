import type { HeaderOptions } from '../types';

export default function getHeaderTitle(
  options: HeaderOptions & { title?: string },
  fallback: string
): string {
  return typeof options.headerTitle === 'string'
    ? options.headerTitle
    : options.title !== undefined
    ? options.title
    : fallback;
}
